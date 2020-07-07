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
import { command, Features } from "@vertigis/web/messaging";
import type Graphic from "esri/Graphic";
import Query from "esri/tasks/support/Query";
import QueryTask from "esri/tasks/QueryTask";
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
    type: "surveyor";
}

export interface SurveyNodeObject extends ForceNodeObject {
    type: "inspection";
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
    // This will be populated from the app configuration item reference configured in getSerializableProperties
    surveyTableExtension: TableExtension | undefined;

    // TODO: import branding service and get the theme's branding background color to set on the graph

    inspections: Feature[] = [];
    graphData: GraphData = { links: [], nodes: [] };

    handleNodeClick = async (node: NodeObject) => {
        if (node.type === "surveyor") {
            return;
        }

        const inspection = this.inspections.find(
            (inspection) => inspection.attributes.get("OBJECTID") === node.id
        );
        if (!inspection) {
            return;
        }

        // .replaceFocus instead?
        await this.messages.commands.highlights.clearFocus.execute();
        await this.messages.commands.highlights.addFocus.execute(inspection);
        await this.messages.commands.results.displayDetails.execute(inspection);
    };

    handleNodeHover = async (node: NodeObject) => {
        if (node.type === "surveyor") {
            return;
        }

        const inspection = this.inspections.find(
            (inspection) => inspection.attributes.get("OBJECTID") === node.id
        );
        if (!inspection) {
            return;
        }

        // TODO: Find the hydrant that this inspection maps to and use in the commands

        // .replaceFocus instead?
        await this.messages.commands.highlights.clearFocus.execute();
        await this.messages.commands.highlights.addFocus.execute(inspection);
    };

    @command("three-dimensional-graph.display")
    protected async _handleDisplayGraph(inFeatures: Features): Promise<void> {
        const features = await toFeatureArray(inFeatures);
        const hydrantFeatures = features
            // We're only interested in the fire hydrant features.
            .filter(
                (feature) =>
                    // TODO: I'm sure there's a better way to filter this...
                    typeof feature.attributes.get("HYDRANT_NUM") === "string"
            );
        const hydrantIds = hydrantFeatures.map(
            (feature) =>
                // Wrap in quotes as this field is a string type.
                `'${feature.attributes.get("HYDRANT_NUM") as string}'`
        );

        let inspections: Feature[] = [];
        const surveyors: Record<string, boolean> = {};
        const newGraphData: GraphData = { links: [], nodes: [] };

        if (hydrantIds.length) {
            // Query for the inspections.
            const queryService = new QueryService();
            const result = queryService.query(
                this.surveyTableExtension,
                `HYDRANT_NUM IN (${hydrantIds.join(",")})`
            );
            inspections = await toFeatureArray(new FeatureStream(result));

            // const queryTask = new QueryTask({
            //     url:
            //         "https://services.arcgis.com/p3UBboyC0NH1uCie/ArcGIS/rest/services/CapitalCity_Web_Editable_gdb/FeatureServer/1",
            // });
            // const query = new Query();
            // query.outFields = ["*"];
            // query.where = `HYDRANT_NUM IN (${hydrantIds.join(",")})`;
            // const result2 = await queryTask.execute(query);

            // Parse the inspections and create the graph nodes/links.
            for (const inspection of inspections) {
                const hydrantNum: string = inspection.attributes.get(
                    "HYDRANT_NUM"
                );
                const surveyor: string = inspection.attributes.get("SURVEYOR");
                const inspectionId: number = inspection.attributes.get(
                    "OBJECTID"
                );
                const inspectionResult:
                    | "PASS"
                    | "FAIL" = inspection.attributes.get("RESULT");
                const inspectionDate: number = inspection.attributes.get(
                    "SURVEY_DATE"
                );

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

                // Create a node for the inspection
                newGraphData.nodes.push({
                    id: inspectionId,
                    type: "inspection",
                    date: inspectionDate,
                    hydrantNum,
                    result: inspectionResult,
                });

                // Create a link between the inspection and the surveyor
                newGraphData.links.push({
                    source: surveyor,
                    target: inspectionId,
                });
            }
        }

        this.inspections = inspections;
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
