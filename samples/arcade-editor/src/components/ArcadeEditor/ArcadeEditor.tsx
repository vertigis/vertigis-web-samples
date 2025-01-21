import { ArcgisArcadeEditor } from "@arcgis/coding-components-react";
import { CalciteScrim } from "@esri/calcite-components-react";
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatch } from "@vertigis/web/ui";
import Paper from "@vertigis/web/ui/Paper";
import { type ReactElement } from "react";

import type ArcadeEditorModel from "./ArcadeEditorModel";

import "./ArcadeEditor.css";

type ArcadeEditorProps = LayoutElementProperties<ArcadeEditorModel>;

const ArcadeEditor = (props: ArcadeEditorProps): ReactElement => {
    const { model } = props;
    const { data } = model;

    useWatch(model, "data", () => console.log(data));

    return (
        <LayoutElement
            {...props}
            stretch
            className="arcade-editor-webcomponent"
        >
            <Paper className="editor-wrapper">
                {data ? (
                    <ArcgisArcadeEditor
                        // Set the script on the editor
                        script="$featureSet"
                        // Log script change events
                        onArcgisScriptChange={async (e) => {
                            console.log("script:", e.detail);
                            // console.log("outputType on script:", await arcadeEditorElt.getOutputType());
                        }}
                        // Log editor diagnostics
                        onArcgisDiagnosticsChange={async (e) => {
                            console.log("diagnostics:", e.detail);
                        }}
                        // Tells the Arcade editor to use a custom profile with
                        // the defined variables and bundles loaded.
                        profile={{
                            label: "My Custom Arcade Profile",
                            variables: [
                                {
                                    name: "$feature",
                                    description:
                                        "Provide a single feature from a featureSet. Use the same definition as you would use for a featureSet.",
                                    type: "feature",
                                    definition: {
                                        fields: data.featureLayer.fields,
                                    },
                                },
                                {
                                    name: "$featureSet",
                                    description:
                                        "Use a field collection as the definition for a featureSet to provide arbitrary data that isn't linked to a layer.",
                                    type: "featureSet",
                                    definition: {
                                        fields: data.featureLayer.fields,
                                    },
                                },
                                {
                                    name: "$layer",
                                    description:
                                        "Use the portal id of a layer as the definition for a featureSet to provide data originating from that layer.",
                                    type: "featureSet",
                                    definition: {
                                        portalItem: {
                                            id: data.featureLayer.id,
                                        },
                                    },
                                },
                                {
                                    name: "$map",
                                    description:
                                        "Use the id of a webmap as the definition for a featureSetCollection to access data from that webmap.",
                                    type: "featureSetCollection",
                                    definition: {
                                        portalItem: {
                                            id: "12391f2d60ca49c189114a837e508ca2",
                                        },
                                    },
                                },
                                {
                                    name: "$datastore",
                                    description:
                                        "Use the url of a feature service as the definition for a featureSetCollection to access data from that service.",
                                    type: "featureSetCollection",
                                    definition: { url: data.featureLayer.url },
                                },
                            ],
                            bundles: ["core", "data-access", "geometry"],
                        }}
                        // Tells Arcade editor to use the following test data.
                        // The data provided must match the expected data for
                        // the variables defined in the profile.
                        testData={{
                            profileVariableInstances: {
                                $feature: data.featureSet.features[0],
                                $featureSet: data.featureSet,
                                $layer: data.featureLayer,
                                $map: data.webMap,
                                $datastore: data.featureLayer.url,
                            },
                            spatialReference: data.featureSet.spatialReference,
                        }}
                    />
                ) : (
                    <CalciteScrim loading />
                )}
            </Paper>
        </LayoutElement>
    );
};

export default ArcadeEditor;
