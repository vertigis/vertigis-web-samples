import { LibraryRegistry } from "@vertigis/web/config";
import CustomService from "./services/CustomService";

export default function (registry: LibraryRegistry) {
    registry.registerService({
        id: "custom-service",
        getService: () => new CustomService(),
    });

    registry.registerCommand({
        name: "custom-service.send-message",
        serviceId: "custom-service",
    });
    registry.registerCommand({
        name: "custom-service.toggle-can-execute",
        serviceId: "custom-service",
    });
    registry.registerCommand({
        name: "custom-service.command-with-can-execute",
        serviceId: "custom-service",
    });

    registry.registerOperation({
        name: "custom-service.get-message-history",
        serviceId: "custom-service",
    });
}
