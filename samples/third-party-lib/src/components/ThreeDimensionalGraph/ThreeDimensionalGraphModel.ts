import { ComponentModelBase, serializable } from "@vertigis/web/models";
import { command, Features } from "@vertigis/web/messaging";
import Query from "esri/tasks/support/Query";
import QueryTask from "esri/tasks/QueryTask";
import type { GraphData } from "force-graph";
import { toFeatureArray } from "./utils";

// 1. Implement command that takes features and translate into graph data
// 2. Button that has action that:
// Capture geom
// Identify
// results.display?
// Custom command that takes in `Features` - must be converted using ex. toFeatureArray, toFeatureStream found in common/utilities/messaging

@serializable
export default class EmbeddedMapModel extends ComponentModelBase {
    graphData: GraphData = { links: [], nodes: [] };

    @command("three-dimensional-graph.show")
    protected async _handleShowGraph(inFeatures: Features): Promise<void> {
        const features = await toFeatureArray(inFeatures);
        const hydrantIds = features
            .map(
                (feature) =>
                    // Wrap in quotes as this column is a string type
                    `'${feature.attributes.get("HYDRANT_NUM") as string}'`
            )
            .filter(Boolean);

        const queryTask = new QueryTask({
            url:
                "https://services.arcgis.com/p3UBboyC0NH1uCie/ArcGIS/rest/services/CapitalCity_Web_Editable_gdb/FeatureServer/1",
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `HYDRANT_NUM IN (${hydrantIds.join(",")})`;

        const results = await queryTask.execute(query);

        const inspectorData: Record<
            string,
            Array<{
                date: number;
                hydrantNum: string;
                id: number;
                result: string;
            }>
        > = {};

        for (const result of results.features) {
            const hydrantNum = result.getAttribute("HYDRANT_NUM");
            const inspector = result.getAttribute("SURVEYOR");
            const inspectionId = result.getAttribute("OBJECTID");
            const inspectionResult = result.getAttribute("RESULT");
            const inspectionDate = result.getAttribute("SURVEY_DATE");

            // Initialize an empty array for this inspector if it doesn't exist
            // already.
            if (!inspectorData[inspector]) {
                inspectorData[inspector] = [];
            }

            // Add new inspection for this inspector
            inspectorData[inspector].push({
                date: inspectionDate,
                hydrantNum,
                id: inspectionId,
                result: inspectionResult,
            });
        }

        const newGraphData: GraphData = { links: [], nodes: [] };

        for (const [inspector, inspections] of Object.entries(inspectorData)) {
            // Create a node for the inspector
            newGraphData.nodes.push({ id: inspector });

            // Create nodes for each of the inspections
            for (const inspection of inspections) {
                newGraphData.nodes.push({ id: inspection.id });
                newGraphData.links.push({
                    source: inspector,
                    target: inspection.id,
                });
            }
        }

        console.log(newGraphData);

        this.graphData = newGraphData;
    }
}
