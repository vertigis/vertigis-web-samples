import { LibraryRegistry } from "@vertigis/web/config";
import RouteService from "./services/RouteService";

export default function (registry: LibraryRegistry) {
    registry.registerService({
        id: "custom-route-service",
        getService: () => new RouteService(),
    });

    registry.registerCommand({
        name: "custom-route-service.add-point",
        serviceId: "custom-route-service",
    });
}
