import { version } from "esri/kernel";
import * as watchUtils from "esri/core/watchUtils";
import MapView from "esri/views/MapView";
import SceneView from "esri/views/SceneView";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { ComponentModelBase } from "@vertigis/web/models";
import React from "react";

export type MapOrSceneView = MapView | SceneView;
export interface MapWidget extends __esri.Widget {
    view: MapOrSceneView;
}
export type MapWidgetConstructor = new (
    props: __esri.WidgetProperties & {
        view: MapOrSceneView;
        container: HTMLElement;
    }
) => MapWidget;
// TODO: Use correct type for `map` after 5.10 release.
export type ModelWithMap = ComponentModelBase & { map: any };
export interface MapWidgetProps<M extends ModelWithMap>
    extends LayoutElementProperties<M> {
    onWidgetCreated?: (widget: MapWidget) => void;
    onWidgetDestroyed?: () => void;
}

export interface MapWidgetContainerProperties {
    tabIndex?: number;
}

/**
 * Creates a React component that wraps an Esri map widget. It requires a model
 * that imports a MapModel.
 * @param widgetType The type of Esri widget to wrap.
 */
export function createEsriMapWidget<M extends ModelWithMap>(
    widgetType: MapWidgetConstructor,
    containerProperties?: MapWidgetContainerProperties,
    stretch?: boolean
): React.ComponentType<MapWidgetProps<M>> {
    return class extends React.Component<MapWidgetProps<M>> {
        private _widget: MapWidget;
        private _handle: IHandle;
        private readonly _rootRef = React.createRef<HTMLDivElement>();

        render(): React.ReactNode {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { onWidgetCreated, onWidgetDestroyed, ...other } = this.props;
            return (
                <LayoutElement stretch={stretch} {...other}>
                    <div ref={this._rootRef} />
                </LayoutElement>
            );
        }

        async componentDidMount(): Promise<void> {
            await this._injectCssIfNeeded();
            await watchUtils.whenOnce(
                this.props.model as any,
                "map.view",
                () => {
                    if (!this._rootRef.current) {
                        return;
                    }
                    this._createWidget();
                    this._handle = this.props.model.watch(
                        "map.view",
                        (view) => {
                            this._destroyWidget();
                            if (view) {
                                this._createWidget();
                            }
                        }
                    );
                }
            );
        }

        componentWillUnmount(): void {
            this._destroyWidget();
            if (this._handle) {
                this._handle.remove();
            }
        }

        private async _injectCssIfNeeded(): Promise<void> {
            const styleLinkHref = `https://js.arcgis.com/${version}/esri/themes/light/main.css`;

            if (document.querySelector(`link[href="${styleLinkHref}"`)) {
                return Promise.resolve();
            }

            // Wait until stylesheet loaded to avoid flash of un-styled DOM.
            return new Promise((resolve, reject) => {
                const styleLink = document.createElement("link");
                styleLink.rel = "stylesheet";
                styleLink.href = styleLinkHref;
                styleLink.onload = () => resolve();
                styleLink.onerror = reject;
                document.head.appendChild(styleLink);
            });
        }

        private _createWidget(): void {
            // If we give Esri's widget a DOM element managed by React, it will
            // delete the element once destroyed, causing React to freak out.
            // Instead, create one manually.
            const container = document.createElement("div");
            if (
                containerProperties &&
                typeof containerProperties.tabIndex === "number"
            ) {
                container.tabIndex = containerProperties.tabIndex;
            }
            this._rootRef.current.appendChild(container);

            this._widget = new widgetType({
                view: this.props.model.map.view,
                container,
            });

            if (this.props.onWidgetCreated) {
                this.props.onWidgetCreated(this._widget);
            }
        }

        private _destroyWidget(): void {
            if (!this._widget) {
                return;
            }

            this._widget.destroy();
            this._widget = undefined;
            if (this.props.onWidgetDestroyed) {
                this.props.onWidgetDestroyed();
            }
        }
    };
}
