import type { Feature } from "@vertigis/arcgis-extensions/data/Feature";
import { FeatureStream } from "@vertigis/arcgis-extensions/data/FeatureStream";
import type { TableExtension } from "@vertigis/arcgis-extensions/data/TableExtension";
import type { LayerExtension } from "@vertigis/arcgis-extensions/mapping/LayerExtension";
import { QueryService } from "@vertigis/arcgis-extensions/tasks/query/QueryService";
import type { BrandingService } from "@vertigis/web/branding/BrandingService";
import type { Features } from "@vertigis/web/messaging";
import { command } from "@vertigis/web/messaging";
import { ComponentModelBase, serializable } from "@vertigis/web/models";
import type {
    PropertyDefs,
    ComponentModelProperties,
} from "@vertigis/web/models";
import { inject, FrameworkServiceType } from "@vertigis/web/services";
import { sanitizeHtml, stripHtml } from "@vertigis/web/ui";
import type {
    GraphData as ForceGraphData,
    LinkObject,
    NodeObject as ForceNodeObject,
} from "force-graph";

import { toFeatureArray } from "./utils";

interface ThreeDimensionalGraphModelProperties
    extends ComponentModelProperties {
    hydrantLayerExtension?: LayerExtension;
    surveyTableExtension?: TableExtension;
}

export interface SurveyorNodeObject extends ForceNodeObject {
    id: string;
    type: "surveyor";
}

export interface SurveyNodeObject extends ForceNodeObject {
    id: number;
    type: "survey";
    date: number;
    hydrantNum: string;
    result: "PASS" | "FAIL";
}

export type NodeObject = SurveyorNodeObject | SurveyNodeObject;

export interface GraphData extends ForceGraphData {
    nodes: NodeObject[];
    links: LinkObject[];
}

@serializable
export default class ThreeDimensionalGraphModel extends ComponentModelBase<ThreeDimensionalGraphModelProperties> {
    @inject(FrameworkServiceType.BRANDING)
    brandingService: BrandingService | undefined;

    // These will be populated from the app config item reference.
    hydrantLayerExtension: LayerExtension | undefined;
    surveyTableExtension: TableExtension | undefined;

    selectedSurveyId: number | undefined;
    hydrants: Record<string, Feature> = {};
    surveys: Record<number, Feature> = {};
    graphData: GraphData = { links: [], nodes: [] };

    getNodeLabel = (node: NodeObject): string => {
        // WARNING: Be careful when using string concatenation that will be used
        // in the DOM. In this case, the force-graph library supports supplying
        // HTML content as a string. There's potential for malicious HTML to be
        // contained within the feature data that we are displaying here, and
        // thus we must sanitize it before rendering it in the DOM.

        if (node.type === "surveyor") {
            return stripHtml(`Surveyor: ${node.id}`);
        }

        return sanitizeHtml(`Hydrant Survey<br />
        Survey ID: ${node.id}<br />
        Hydrant number: ${node.hydrantNum}<br />
        Result: ${node.result}<br />
        Date: ${new Date(node.date).toLocaleString()}`);
    };

    getNodeColor = (node: NodeObject): string => {
        if (node.type === "surveyor") {
            return (
                this.brandingService?.activeTheme.colors
                    .get("primaryForeground")
                    .toHex() ?? "white"
            );
        } else if (node.id === this.selectedSurveyId) {
            // Show similar color as the focus highlight on the map
            // when the node is selected.
            return "teal";
        } else if (node.result === "FAIL") {
            return "red";
        } else {
            return "green";
        }
    };

    handleNodeClick = async (node: NodeObject): Promise<void> => {
        if (node.type === "surveyor") {
            return;
        }

        const survey = this.surveys[node.id];
        const hydrant = this.hydrants[node.hydrantNum];
        if (!survey || !hydrant) {
            return;
        }

        this.selectedSurveyId = node.id;
        await this.messages.commands.highlights.clearFocus.execute();
        await this.messages.commands.highlights.addFocus.execute(hydrant);
        await this.messages.commands.results.displayDetails.execute(survey);
    };

    handleNodeHover = async (node: NodeObject | null): Promise<void> => {
        // Nothing to do for surveyor nodes.
        if (!node || node.type === "surveyor") {
            return;
        }

        const hydrant = this.hydrants[node.hydrantNum];
        if (hydrant) {
            await this.messages.commands.highlights.pulse.execute(hydrant);
        }
    };

    // Handle this command even when the component is inactive, which gives us
    // an opportunity to activate it.
    @command("three-dimensional-graph.display", { targetInactive: true })
    protected async _handleDisplayGraph(inFeatures: Features): Promise<void> {
        await this.messages.commands.ui.activate.execute(this);

        const features = await toFeatureArray(inFeatures);
        const hydrantFeatures = features.filter(
            (feature) => feature.source === this.hydrantLayerExtension
        );
        const hydrantIds = hydrantFeatures.map(
            (feature) =>
                // Wrap in quotes as this field is a string type.
                `'${feature.attributes.get("HYDRANT_NUM") as string}'`
        );

        let surveys: Feature[] = [];
        const surveyors: Record<string, boolean> = {};
        const newGraphData: GraphData = { links: [], nodes: [] };

        if (hydrantIds.length) {
            // Query for the surveys.
            const queryService = new QueryService();
            const result = queryService.query(
                this.surveyTableExtension,
                `HYDRANT_NUM IN (${hydrantIds.join(",")})`
            );
            surveys = await toFeatureArray(new FeatureStream(result));

            // Parse the surveys and create the graph nodes/links.
            for (const survey of surveys) {
                const hydrantNum = survey.attributes.get(
                    "HYDRANT_NUM"
                ) as string;
                const surveyor = survey.attributes.get("SURVEYOR") as string;
                const surveyId = survey.attributes.get("OBJECTID") as number;
                const surveyResult = survey.attributes.get("RESULT") as
                    | "PASS"
                    | "FAIL";
                const surveyDate = survey.attributes.get(
                    "SURVEY_DATE"
                ) as number;

                // Initialize an empty array for this inspector if it doesn't exist
                // already.
                if (!surveyors[surveyor]) {
                    // Create a node for the surveyor
                    newGraphData.nodes.push({
                        id: surveyor,
                        type: "surveyor",
                    });

                    // Set a flag so we don't create the surveyor again
                    surveyors[surveyor] = true;
                }

                // Create a node for the survey
                newGraphData.nodes.push({
                    id: surveyId,
                    type: "survey",
                    date: surveyDate,
                    hydrantNum,
                    result: surveyResult,
                });

                // Create a link between the survey and the surveyor
                newGraphData.links.push({
                    source: surveyor,
                    target: surveyId,
                });
            }
        }

        // Hold on to the features for easy access later on in click/hover events from the graph.
        this.hydrants = hydrantFeatures.reduce<Record<string, Feature>>(
            (acc, hydrant) => {
                const hydrantNum = hydrant.attributes.get(
                    "HYDRANT_NUM"
                ) as string;
                acc[hydrantNum] = hydrant;
                return acc;
            },
            {}
        );
        this.surveys = surveys.reduce<Record<number, Feature>>(
            (acc, survey) => {
                const surveyId = survey.attributes.get("OBJECTID") as number;
                acc[surveyId] = survey;
                return acc;
            },
            {}
        );
        this.graphData = newGraphData;
    }

    protected override _getSerializableProperties(): PropertyDefs<ThreeDimensionalGraphModelProperties> {
        return {
            ...super._getSerializableProperties(),
            // Specifying the serialize modes of these properties is necessary
            // for them to be populated from app config on initialization of
            // this model.
            hydrantLayerExtension: ["initial"],
            surveyTableExtension: ["initial"],
        };
    }
}
