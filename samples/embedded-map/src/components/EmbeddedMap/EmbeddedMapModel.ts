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
    private _map: MapExtension | undefined;
    get map(): MapExtension | undefined {
        return this._map;
    }
    @importModel("map-extension")
    set map(instance: MapExtension | undefined) {
        if (instance === this._map) {
            return;
        }

        // If an instance already exists, clean it up first.
        if (this._map) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._unsyncMaps();
        }

        this._map = instance;

        // A new instance is being set - sync the map.
        if (instance) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._syncMaps();
        }
    }

    // For demonstration purposes only.
    // Replace this with your own client ID from mapillary.com
    readonly mapillaryKey =
        "ZU5PcllvUTJIX24wOW9LSkR4dlE5UTo3NTZiMzY4ZjBlM2U2Nzlm";

    private _mapillary: any | undefined;
    get mapillary(): any | undefined {
        return this._mapillary;
    }
    set mapillary(instance: any | undefined) {
        if (instance === this._mapillary) {
            return;
        }

        // If an instance already exists, clean it up first.
        if (this._mapillary) {
            // Clean up event handlers.
            this.mapillary.off(Viewer.nodechanged, this._onPerspectiveChange);
            this.mapillary.off(Viewer.povchanged, this._onPerspectiveChange);

            // Activating the cover appears to be the best way to "clean up" Mapillary.
            // https://github.com/mapillary/mapillary-js/blob/8b6fc2f36e3011218954d95d601062ff6aa41ad9/src/viewer/ComponentController.ts#L184-L192
            this.mapillary.activateCover();

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._unsyncMaps();
        }

        this._mapillary = instance;

        // A new instance is being set - add the event handlers.
        if (instance) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (async () => {
                // Wait for the initial sync to be setup before listening for
                // events from Mapillary.
                await this._syncMaps();

                // Track changes when the user moves to a different node, or when
                // their bearing/tilt position changes.
                this.mapillary.on(
                    Viewer.nodechanged,
                    this._onPerspectiveChange
                );
                this.mapillary.on(Viewer.povchanged, this._onPerspectiveChange);
            })();
        }
    }

    /**
     * Setup the initial state of the maps such as the location marker and map
     * position.
     */
    private async _syncMaps(): Promise<void> {
        if (!this.map || !this.mapillary) {
            return;
        }

        // Create location marker based on current location from Mapillary and
        // pan/zoom Geocortex map to the location.
        const [{ lat, lon }, bearing] = await Promise.all([
            this.mapillary.getPosition(),
            this.mapillary.getBearing(),
        ]);
        const centerPoint = new Point({ latitude: lat, longitude: lon });
        await Promise.all([
            this.messages.commands.locationMarker.create.execute({
                fov: 30,
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
                    scale: 3000,
                },
            }),
        ]);
    }

    private async _unsyncMaps(): Promise<void> {
        await this.messages.commands.locationMarker.remove.execute({
            id: this.id,
            maps: this.map,
        });
    }

    // Throttle the updates to the Map to avoid overwhelming with pan/zoom
    // commands.
    private _onPerspectiveChange = throttle(async () => {
        if (!this.map || !this.mapillary) {
            return;
        }

        const [{ lat, lon }, bearing] = await Promise.all([
            this.mapillary.getPosition(),
            this.mapillary.getBearing(),
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
                    scale: 3000,
                },
            }),
        ]);
    }, 128);
}
