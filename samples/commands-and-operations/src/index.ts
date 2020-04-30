import { LibraryRegistry } from "@geocortex/web/config";
import CustomService from "./services/CustomService";

export default function (registry: LibraryRegistry) {
    registry.registerService({
        id: "custom-service",
        getServiceType: () => CustomService,
    });

    registry.registerCommand("custom-service.send-message", {
        serviceId: "custom-service",
        executeMethodName: "_handleSendMessage",
    });

    registry.registerOperation("custom-service.get-command-history", {
        serviceId: "custom-service",
        executeMethodName: "_getCommandHistory",
    });
}
