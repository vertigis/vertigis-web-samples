import { MapModel } from "@vertigis/web/mapping";
import {
    ComponentModelBase,
    serializable,
    importModel,
} from "@vertigis/web/models";
import { throttle } from "@vertigis/web/ui";
import Point from "@arcgis/core/geometry/Point";
import { IViewer, LngLat, ViewerImageEvent } from "mapillary-js";

/**
 *  Convert Mapillary bearing to a Scene's camera rotation.
 *  @param bearing Mapillary bearing in degrees (degrees relative to due north).
 *  @returns Scene camera rotation in degrees (degrees rotation of due north).
 */
function getCameraRotationFromBearing(bearing: number): number {
    return 360 - bearing;
}

interface MapillaryCamera {
    latitude: number;
    longitude: number;
    heading: number;
    tilt: number;
    fov: number;
}

@serializable
export default class EmbeddedMapModel extends ComponentModelBase {
    // For demonstration purposes only.
    // Replace this with your own client ID from mapillary.com
    readonly mapillaryKey =
        "MLY|4371038552987952|3051b8de90b9a19c55ba2e5edd9376db";

    // The computed position of the current Mapillary image
    private _currentImagePosition: LngLat;

    private _mapillary: IViewer | undefined;
    get mapillary(): IViewer | undefined {
        return this._mapillary;
    }
    set mapillary(instance: IViewer | undefined) {
        if (instance === this._mapillary) {
            return;
        }

        // If an instance already exists, clean it up first.
        if (this._mapillary) {
            // Clean up event handlers.
            this.mapillary.off("image", this._onImageChange);
            this.mapillary.off("pov", this._onPerspectiveChange);

            // Activating the cover appears to be the best way to "clean up" Mapillary.
            // https://github.com/mapillary/mapillary-js/blob/8b6fc2f36e3011218954d95d601062ff6aa41ad9/src/viewer/ComponentController.ts#L184-L192
            this.mapillary.activateCover();

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._unsyncMaps();
        }

        this._mapillary = instance;

        // A new instance is being set - add the event handlers.
        if (instance) {
            const syncMaps = async (event: ViewerImageEvent) => {
                const { image } = event;
                if (image.merged) {
                    // Remove this handler
                    this.mapillary.off("image", syncMaps as any);

                    this._currentImagePosition = image.lngLat;

                    // Wait for initial sync
                    await this._syncMaps();

                    // Listen for changes to the currently displayed mapillary image
                    this.mapillary.on("image", this._onImageChange);

                    // Handle further pov changes on this image
                    this.mapillary.on("pov", this._onPerspectiveChange);
                }
            };

            // Wait for the first mapillary image to be ready before attempting
            // to sync the maps
            this.mapillary.on("image", syncMaps as any);
        }
    }

    private _map: MapModel | undefined;
    get map(): MapModel | undefined {
        return this._map;
    }
    @importModel("map-extension")
    set map(instance: MapModel | undefined) {
        if (instance === this._map) {
            return;
        }

        // If an instance already exists, clean it up first.
        if (this._map) {
            void this._unsyncMaps();
        }

        this._map = instance;

        // A new instance is being set - sync the map.
        if (instance) {
            void this._syncMaps();
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
        // pan/zoom VertiGIS Studio map to the location.
        const { latitude, longitude, heading, tilt, fov } =
            await this._getMapillaryCamera();

        const centerPoint = new Point({ latitude, longitude });
        await Promise.all([
            this.messages.commands.locationMarker.create.execute({
                fov,
                geometry: centerPoint,
                heading,
                tilt,
                id: this.id,
                maps: this.map,
            }),
            this.messages.commands.map.zoomToViewpoint.execute({
                maps: this.map,
                viewpoint: {
                    rotation: getCameraRotationFromBearing(heading),
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

    /**
     * When the 'merged' property is set on the image we know that the position
     * reported will be the computed location rather than a raw GPS value. We
     * ignore all updates sent while the computed position is unknown as the raw
     * GPS value can be inaccurate and will not exactly match the observed
     * position of the camera.
     */
    private _onImageChange = (event: ViewerImageEvent) => {
        const { image } = event;
        if (image.merged) {
            this._currentImagePosition = image.lngLat;

            // Set the initial marker position for this image.
            this._onPerspectiveChange();

            // Handle further pov changes.
            this.mapillary.on("pov", this._onPerspectiveChange);
        } else {
            this._currentImagePosition = undefined;
            this.mapillary.off("pov", this._onPerspectiveChange);
        }
    };

    /**
     * Handles pov changes once the image position is known.
     */
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    private _onPerspectiveChange = throttle(async () => {
        if (!this.map || !this.mapillary) {
            return;
        }

        const { latitude, longitude, heading, tilt, fov } =
            await this._getMapillaryCamera();

        const centerPoint = new Point({
            latitude,
            longitude,
        });

        await Promise.all([
            this.messages.commands.locationMarker.update.execute({
                geometry: centerPoint,
                heading,
                tilt,
                fov,
                id: this.id,
                maps: this.map,
            }),
            this.messages.commands.map.zoomToViewpoint.execute({
                maps: this.map,
                viewpoint: {
                    rotation: getCameraRotationFromBearing(heading),
                    targetGeometry: centerPoint,
                    scale: 3000,
                },
            }),
        ]);
    }, 128);

    /**
     * Gets the current POV of the mapillary camera
     */
    private async _getMapillaryCamera(): Promise<MapillaryCamera | undefined> {
        if (!this.mapillary) {
            return undefined;
        }

        // Will return a raw GPS value if the image position has not yet been calculated.
        const [{ lat, lng }, { bearing, tilt }, fov] = await Promise.all([
            this._currentImagePosition ?? this.mapillary.getPosition(),
            this.mapillary.getPointOfView(),
            this.mapillary.getFieldOfView(),
        ]);

        return {
            latitude: lat,
            longitude: lng,
            heading: bearing,
            tilt: tilt + 90,
            fov,
        };
    }
}
