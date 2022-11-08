import { ServiceBase } from "@vertigis/web/services";
import Geometry from "@arcgis/core/geometry/Geometry";
import Graphic from "@arcgis/core/Graphic";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { solve } from "@arcgis/core/rest/route";
import FeatureSet from "@arcgis/core/tasks/support/FeatureSet";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import { command } from "@vertigis/web/messaging";

const pointSymbol = new SimpleMarkerSymbol({
    outline: {
        width: 3,
    },
    style: "cross",
    size: 14,
});
const routeSymbol = new SimpleLineSymbol({
    color: [41, 98, 255, 0.8],
    width: 3,
});

const ROUTE_URL = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route";

export default class RouteService extends ServiceBase {
    stops = new FeatureSet();

    @command("custom-route-service.add-point")
    protected async _handleAddPointCommand(result: {
        geometry: Geometry;
    }): Promise<void> {
        const promises: Promise<void>[] = [];

        const graphic = new Graphic({
            geometry: result.geometry,
            symbol: pointSymbol,
        });
        promises.push(this.messages.commands.map.addMarkup.execute(graphic));

        // Keep track of each of the stops to be used in the RouteTask.
        this.stops.features.push(graphic);
        if (this.stops.features.length >= 2) {
            promises.push(this._solveRoute());
        }

        await Promise.all(promises);
    }

    protected async _solveRoute(): Promise<void> {
        const routeParams = new RouteParameters({
            stops: this.stops,
            outSpatialReference: {
                wkid: 3857,
            },
        });

        const data = await solve(ROUTE_URL, routeParams);
        const routeResult = data.routeResults[0].route;
        // Use our own symbol
        routeResult.symbol = routeSymbol;
        await this.messages.commands.map.addMarkup.execute(routeResult);
    }
}
