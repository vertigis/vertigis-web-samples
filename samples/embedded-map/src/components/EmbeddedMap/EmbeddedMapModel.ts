import { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import {
    ComponentModelBase,
    serializable,
    importModel,
} from "@vertigis/web/models";
import Point from "esri/geometry/Point";
import { Viewer } from "mapillary-js/";
import { throttle } from "@vertigis/web/ui";

@serializable
export default class EmbeddedMapModel extends ComponentModelBase {
    private _map: MapExtension | undefined;
    get map() {
        return this._map;
    }
    @importModel("map-extension")
    set map(map: MapExtension | undefined) {
        this._map = map;
        // TODO: What if map was previously set but becomes undefined? What
        // should we do?
    }

    private _mly: any;

    async initializeEmbeddedMap() {
        if (!this.isInitialized || !this.map) {
            return;
        }

        this._mly = new Viewer(
            this.id,
            "QjI1NnU0aG5FZFZISE56U3R5aWN4Zzo3NTM1MjI5MmRjODZlMzc0",
            "iSGUzGWPuQ7BbRdc7jhEjj",
            {
                component: {
                    // Initialize immediately
                    cover: false,
                },
            }
        );

        // Create location marker based on current location from street view
        const [{ lat, lon }, bearing] = await Promise.all([
            this._mly.getPosition(),
            this._mly.getBearing(),
        ]);
        const centerPoint = new Point({ latitude: lat, longitude: lon });
        await Promise.all([
            commands.locationMarker.create.execute({
                fov: 30,
                geometry: centerPoint,
                heading: Math.floor(bearing),
                id: this.id,
                maps: model.map,
                // userDraggable: true,
            }),
            commands.map.zoomToViewpoint.execute({
                maps: model.map,
                viewpoint: {
                    targetGeometry: centerPoint,
                    scale: 3000,
                },
            }),
        ]);

        // Track changes when the user moves to a different node, or when
        // their bearing/tilt position changes.
        this._mly.on(Viewer.nodechanged, this._onPerspectiveChange);
        this._mly.on(Viewer.povchanged, this._onPerspectiveChange);
    }

    resize(): void {
        if (this.mly) {
            this._mly.resize();
        }
    }

    protected async _onDestroy() {
        await super._onDestroy();
        // TODO: How to clean up mly? They don't expose destroy or anything
        // AFAIK.
        this._mly = undefined;
    }

    // Many events are fired during node transitions or bearing/tilt
    // changes. Throttle so we don't spam the map.
    private _onPerspectiveChange = throttle(async () => {
        const [{ lat, lon }, bearing] = await Promise.all([
            this._mly.getPosition(),
            this._mly.getBearing(),
        ]);

        const centerPoint = new Point({
            latitude: lat,
            longitude: lon,
        });
        await Promise.all([
            this.messages.commands.locationMarker.update.execute({
                geometry: centerPoint,
                heading: Math.floor(bearing),
                id: this.id,
                maps: model.map,
            }),
            this.messages.commands.map.zoomToViewpoint.execute({
                maps: model.map,
                viewpoint: {
                    targetGeometry: centerPoint,
                    scale: 3000,
                },
            }),
        ]);
    }, 16);
}
