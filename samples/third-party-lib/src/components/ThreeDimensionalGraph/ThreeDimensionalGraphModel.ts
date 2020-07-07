import { Feature } from "@vertigis/arcgis-extensions/data/Feature";
import { FeatureStream } from "@vertigis/arcgis-extensions/data/FeatureStream";
import { TableExtension } from "@vertigis/arcgis-extensions/data/TableExtension";
import { QueryService } from "@vertigis/arcgis-extensions/tasks/query/QueryService";
import {
    ComponentModelBase,
    serializable,
    PropertyDefs,
    ComponentModelProperties,
} from "@vertigis/web/models";
import { BrandingService } from "@vertigis/web/branding/BrandingService";
import { command, Features } from "@vertigis/web/messaging";
import { inject, FrameworkServiceType } from "@vertigis/web/services";
import type {
    GraphData as ForceGraphData,
    LinkObject,
    NodeObject as ForceNodeObject,
} from "force-graph";
import { toFeatureArray } from "./utils";

interface ThreeDimensionalGraphModelProperties
    extends ComponentModelProperties {
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
export default class ThreeDimensionalGraphModel extends ComponentModelBase<
    ThreeDimensionalGraphModelProperties
> {
    @inject(FrameworkServiceType.BRANDING)
    brandingService: BrandingService | undefined;

    // This will be populated from the app configuration item reference
    // configured in this._getSerializableProperties
    surveyTableExtension: TableExtension | undefined;

    selectedSurveyId: number | undefined;
    hydrants: Record<string, Feature> = {};
    surveys: Record<number, Feature> = {};
    graphData: GraphData = { links: [], nodes: [] };

    getNodeLabel = (node: NodeObject): string => {
        if (node.type === "surveyor") {
            return `Surveyor: ${node.id}`;
        }

        return `Hydrant Survey<br />
        Survey ID: ${node.id}<br />
        Hydrant number: ${node.hydrantNum}<br />
        Result: ${node.result}<br />
        Date: ${new Date(node.date).toLocaleString()}`;
    };

    getNodeColor = (node: NodeObject): string => {
        if (node.type === "surveyor") {
            return (
                this.brandingService?.activeTheme.colors
                    .get("primaryForeground")
                    .toHex() ?? "white"
            );
        }

        // Show similar color as the focus highlight on the map
        // when the node is selected.
        if (node.id === this.selectedSurveyId) {
            return "teal";
        }

        if (node.result === "FAIL") {
            return "red";
        }

        return "green";
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
        // TODO: Focus persists after closing details panel.
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
        const hydrantFeatures = features
            // We're only interested in the fire hydrant features.
            .filter(
                (feature) =>
                    typeof feature.attributes.get("HYDRANT_NUM") === "string"
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
                const hydrantNum: string = survey.attributes.get("HYDRANT_NUM");
                const surveyor: string = survey.attributes.get("SURVEYOR");
                const surveyId: number = survey.attributes.get("OBJECTID");
                const surveyResult: "PASS" | "FAIL" = survey.attributes.get(
                    "RESULT"
                );
                const surveyDate: number = survey.attributes.get("SURVEY_DATE");

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
                const hydrantNum: string = hydrant.attributes.get(
                    "HYDRANT_NUM"
                );
                acc[hydrantNum] = hydrant;
                return acc;
            },
            {}
        );
        this.surveys = surveys.reduce<Record<number, Feature>>(
            (acc, survey) => {
                const surveyId: number = survey.attributes.get("OBJECTID");
                acc[surveyId] = survey;
                return acc;
            },
            {}
        );
        this.graphData = newGraphData;
    }

    protected _getSerializableProperties(): PropertyDefs<
        ThreeDimensionalGraphModelProperties
    > {
        return {
            ...super._getSerializableProperties(),
            surveyTableExtension: ["initial"],
        };
    }
}