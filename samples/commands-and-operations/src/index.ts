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
    registry.registerCommand("custom-service.toggle-can-execute", {
        serviceId: "custom-service",
        executeMethodName: "_handleToggleCanExecute",
    });
    registry.registerCommand("custom-service.command-with-can-execute", {
        serviceId: "custom-service",
        executeMethodName: "_handleCommandWithCanExecute",
        canExecuteMethodName: "_canExecuteCommandWithCanExecute",
    });

    registry.registerOperation("custom-service.get-message-history", {
        serviceId: "custom-service",
        executeMethodName: "_handleGetMessageHistory",
    });
}
