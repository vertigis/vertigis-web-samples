import type WebMap from "@arcgis/core/WebMap";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import { isLayerExtension } from "@vertigis/arcgis-extensions/ItemType";
import type { FeatureLayerExtension } from "@vertigis/arcgis-extensions/mapping/FeatureLayerExtension";
import type { MapModel } from "@vertigis/web/mapping/MapModel";
import type { HasFeatures } from "@vertigis/web/messaging";
import { command } from "@vertigis/web/messaging";
import { toFeatureArray } from "@vertigis/web/messaging/featureConversion";
import { toLayerExtension } from "@vertigis/web/messaging/mapConversion";
import type { ComponentModelProperties } from "@vertigis/web/models";
import {
    ComponentModelBase,
    importModel,
    serializable,
} from "@vertigis/web/models";

export interface ArcadeEditorData {
    webMap: WebMap;
    featureLayer: FeatureLayer;
    featureSet: FeatureSet;
}

interface ArcadeEditorModelProperties extends ComponentModelProperties {
    layerName?: string;
}

@serializable
export default class ArcadeEditorModel extends ComponentModelBase<ArcadeEditorModelProperties> {
    @importModel("map-extension")
    get map(): MapModel {
        return this._map;
    }
    set map(value: MapModel) {
        this._map = value;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._onMapChanged();
    }

    data: ArcadeEditorData;
    layerName: string;
    featureLayer: __esri.FeatureLayer;

    private _map: MapModel;

    constructor(props: ArcadeEditorModelProperties) {
        super(props);
        this.layerName = props.layerName;
    }

    @command("arcade-editor.load-data")
    protected async _executeArcadeEditorLoadData(
        args: HasFeatures
    ): Promise<void> {
        const featureSet = new FeatureSet({
            features: (await toFeatureArray(args.features)).map((feature) =>
                feature.toGraphic()
            ),
            fields: this.featureLayer.fields,
            geometryType: "point",
            spatialReference: this.featureLayer.spatialReference,
        });
        this.data = {
            webMap: this.map.webMap as unknown as __esri.WebMap,
            featureLayer: this.featureLayer,
            featureSet,
        };
    }

    protected async _onMapChanged(): Promise<void> {
        if (!this.map) {
            return undefined;
        }

        const extension = toLayerExtension(this.layerName, this.map);

        if (
            isLayerExtension(extension) &&
            (extension as FeatureLayerExtension).layer.type === "feature"
        ) {
            this.featureLayer = (extension as FeatureLayerExtension).layer;
        }

        await this.messages
            .command<HasFeatures>("arcade-editor.load-data")
            .execute({ features: [] });
    }
}
