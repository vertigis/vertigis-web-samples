import { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import { LocationMarkerEvent } from "@vertigis/viewer-spec/messaging/registry/location-marker";
import {
    ComponentModelBase,
    serializable,
    importModel,
} from "@vertigis/web/models";
import { throttle } from "@vertigis/web/ui";
import Point from "esri/geometry/Point";
import { whenDefinedOnce } from "esri/core/watchUtils";
import { Viewer } from "mapillary-js";

/**
 *  Convert Mapillary bearing to a Scene's camera rotation.
 *  @param bearing Mapillary bearing in degrees (degrees relative to due north).
 *  @returns Scene camera rotation in degrees (degrees rotation of due north).
 */
function getCameraRotationFromBearing(bearing: number): number {
    return 360 - bearing;
}

interface MapillaryCameraPosition {
    geometry: __esri.geometry.Point;
    heading?: number;
    tilt?: number;
}

interface GcxMap extends MapExtension {
    view: __esri.SceneView;
}

@serializable
export default class EmbeddedMapModel extends ComponentModelBase {
    // For demonstration purposes only.
    // Replace this with your own client ID from mapillary.com
    readonly mapillaryKey =
        "ZU5PcllvUTJIX24wOW9LSkR4dlE5UTo3NTZiMzY4ZjBlM2U2Nzlm";

    readonly imageQueryUrl = "https://a.mapillary.com/v3/images";
    readonly searchRadius = 500; // meters

    syncGcxMap = true;

    private _currentPosition: MapillaryCameraPosition;
    private _lastMarkerUpdate: LocationMarkerEvent;
    private _updating = false;
    private _viewerUpdateHandle: IHandle;
    private _mouseUp = true;

    private _mapillary: any | undefined;
    get mapillary(): any | undefined {
        return this._mapillary;
    }
    set mapillary(instance: any | undefined) {
        if (instance === this._mapillary) {
            return;
        }

        if (this._viewerUpdateHandle) {
            this._viewerUpdateHandle.remove();
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
            // Track changes when the user moves to a different node, or when
            // their bearing/tilt position changes.
            this.mapillary.on(Viewer.nodechanged, this._onPerspectiveChange);
            this.mapillary.on(Viewer.povchanged, this._onPerspectiveChange);

            // Change the mapillary viewer position when the location marker is moved
            this._viewerUpdateHandle = this.messages.events.locationMarker.updated.subscribe(
                this._handleViewerUpdate.bind(this)
            );
        }
    }

    private _map: GcxMap | undefined;
    get map(): GcxMap | undefined {
        return this._map;
    }
    @importModel("map-extension")
    set map(instance: GcxMap | undefined) {
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
            this.messages.events.map.initialized.subscribe(
                this._syncMaps.bind(this)
            );

            if (!document.body.onmousedown) {
                document.body.onmousedown = () => delete this._lastMarkerUpdate;
            }

            if (!document.body.onmouseup) {
                document.body.onmouseup = () => {
                    if (
                        this.mapillary?.isNavigable &&
                        !this._updating &&
                        this._lastMarkerUpdate
                    ) {
                        this._updating = true;
                        const {
                            geometry,
                            heading,
                            tilt,
                        } = this._lastMarkerUpdate;
                        delete this._lastMarkerUpdate;

                        void this._moveCloseToPosition({
                            geometry: geometry as __esri.geometry.Point,
                            heading,
                            tilt,
                        });
                    }
                };
            }
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

        await whenDefinedOnce(this.map.view, "center");

        // Set mapillary to this location
        await this._moveCloseToPosition({ geometry: this.map.view.center });

        // Create location marker based on current location from Mapillary and
        // pan/zoom Geocortex map to the location.
        const [{ lat, lon }, bearing] = await Promise.all([
            this.mapillary.getPosition(),
            this.mapillary.getBearing(),
        ]);

        // Create a location marker and zoom to it if synced
        const centerPoint = new Point({ latitude: lat, longitude: lon });
        await Promise.all([
            this.messages.commands.locationMarker.create.execute({
                fov: 30,
                geometry: centerPoint,
                heading: bearing,
                id: this.id,
                maps: this.map,
                userDraggable: true,
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

    private _handleViewerUpdate(event: LocationMarkerEvent): void {
        this._lastMarkerUpdate = event;
    }

    private async _moveCloseToPosition(
        pos: MapillaryCameraPosition
    ): Promise<void> {
        // This currently only works in Web Mercator
        const { latitude, longitude } = pos.geometry;

        if (
            this._currentPosition?.geometry?.latitude === latitude &&
            this._currentPosition?.geometry?.longitude === longitude
        ) {
            // no documented way to do this
            return;
        }

        const url = `${this.imageQueryUrl}?client_id=${this.mapillaryKey}&closeto=${longitude},${latitude}&radius=${this.searchRadius}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        const imgkey = data?.features?.[0]?.properties?.key;

        if (imgkey) {
            await this.mapillary.moveToKey(imgkey);
            this._currentPosition = this.mapillary.getPosition();
            this._updating = false;
        } else {
            this._activateCover();
        }
    }

    // Throttle the updates to the Map to avoid overwhelming with pan/zoom
    // commands.
    private _onPerspectiveChange = throttle(async () => {
        if (!this.map || !this.mapillary || this._updating) {
            return;
        }

        this._updating = true;

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

        this._updating = false;
    }, 128);

    private _activateCover() {
        this._updating = false;
        this.mapillary.activateCover();
    }

    // /**
    //  * If we drag the viewer location marker to a place where no mapillary imagery can be found
    //  * we want to update the view to reflect this. Normally mapillary will not show a message and just
    //  * not update, which can be confusing.
    //  */
    // private _showNoImageMessage(show) {
    //     const noImageMessage = document.getElementById("mapillary-no-image-message");
    //     if (noImageMessage) {
    //         noImageMessage.style.display = show ? "block" : "none";
    //     }
    //     const mapillaryUI = document.getElementsByClassName("mapillary-js-dom");
    //     if (mapillaryUI && mapillaryUI[0]) {
    //         (mapillaryUI[0] as HTMLDivElement).style.display = show ? "none" : "block";
    //     }
    // }
}
