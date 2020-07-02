import { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import {
    ComponentModelBase,
    serializable,
    importModel,
} from "@vertigis/web/models";
import { throttle } from "@vertigis/web/ui";
import Point from "esri/geometry/Point";
import { Viewer } from "mapillary-js";

/**
 *  Convert Mapillary bearing to a Scene's camera rotation.
 *  @param bearing Mapillary bearing in degrees (degrees relative to due north).
 *  @returns Scene camera rotation in degrees (degrees rotation of due north).
 */

function getCameraRotationFromBearing(bearing: number): number {
    return 360 - bearing;
}

@serializable
export default class EmbeddedMapModel extends ComponentModelBase {
    @importModel("map-extension")
    map: MapExtension | undefined;

    private _mly: any | undefined;

    initializeEmbeddedMap = async (): Promise<void> => {
        if (!this.isInitialized || !this.map || this._mly) {
            return;
        }

        // Initialize an instance of the Mapillary viewer.
        this._mly = new Viewer(
            this.id,
            // For demonstration purposes only.
            // Replace this with your own client ID from mapillary.com
            "ZU5PcllvUTJIX24wOW9LSkR4dlE5UTo3NTZiMzY4ZjBlM2U2Nzlm",
            "gLV8Jn5A6b6rbVRy2xhkMA",
            {
                component: {
                    // Initialize the view immediately without user interaction.
                    cover: false,
                },
            }
        );

        // Viewer size is dynamic so resize should be called every time the window size changes.
        window.addEventListener("resize", this._onWindowResize);

        // Create location marker based on current location from Mapillary and
        // pan/zoom Geocortex map to the location.
        const [{ lat, lon }, bearing] = await Promise.all([
            this._mly.getPosition(),
            this._mly.getBearing(),
        ]);
        const centerPoint = new Point({ latitude: lat, longitude: lon });
        await Promise.all([
            this.messages.commands.locationMarker.create.execute({
                fov: 30,
                geometry: centerPoint,
                heading: bearing,
                id: this.id,
                maps: this.map,
                // userDraggable: true,
            }),
            this.messages.commands.map.zoomToViewpoint.execute({
                maps: this.map,
                viewpoint: {
                    rotation: getCameraRotationFromBearing(bearing),
                    targetGeometry: centerPoint,
                    scale: 6000,
                },
            }),
        ]);

        // Track changes when the user moves to a different node, or when
        // their bearing/tilt position changes.
        this._mly.on(Viewer.nodechanged, this._onPerspectiveChange);
        this._mly.on(Viewer.povchanged, this._onPerspectiveChange);
    };

    destroyEmbeddedMap = async (): Promise<void> => {
        if (!this._mly) {
            return;
        }

        // Clean up event handlers.
        window.removeEventListener("resize", this._onWindowResize);
        this._mly.off(Viewer.nodechanged, this._onPerspectiveChange);
        this._mly.off(Viewer.povchanged, this._onPerspectiveChange);

        // Activating the cover appears to be the best way to "clean up" Mapillary.
        // https://github.com/mapillary/mapillary-js/blob/8b6fc2f36e3011218954d95d601062ff6aa41ad9/src/viewer/ComponentController.ts#L184-L192
        this._mly.activateCover();
        this._mly = undefined;

        await this.messages.commands.locationMarker.remove.execute({
            id: this.id,
            maps: this.map,
        });
    };

    private _onWindowResize = (): void => {
        if (this._mly) {
            this._mly.resize();
        }
    };

    // Throttle the updates to the Map to avoid overwhelming with pan/zoom
    // commands.
    private _onPerspectiveChange = throttle(async () => {
        if (!this.map || !this._mly) {
            return;
        }

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
                heading: bearing,
                id: this.id,
                maps: this.map,
            }),
            this.messages.commands.map.zoomToViewpoint.execute({
                maps: this.map,
                viewpoint: {
                    rotation: getCameraRotationFromBearing(bearing),
                    targetGeometry: centerPoint,
                    scale: 6000,
                },
            }),
        ]);
    }, 128);
}
