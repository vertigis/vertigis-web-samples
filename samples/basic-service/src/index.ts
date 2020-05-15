import { LibraryRegistry } from "@geocortex/web/config";
import RouteService from "./services/RouteService";

export default function (registry: LibraryRegistry) {
    registry.registerService({
        id: "custom-route-service",
        getServiceType: () => RouteService,
    });

    registry.registerCommand("custom-route-service.add-point", {
        executeMethodName: "_handleAddPointCommand",
        serviceId: "custom-route-service",
    });
}
