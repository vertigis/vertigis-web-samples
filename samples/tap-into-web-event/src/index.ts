import { LibraryRegistry } from "@vertigis/web/config";
import CustomService from "./services/customService/CustomService";

export default function (registry: LibraryRegistry): void {
    registry.registerService({
        id: "custom-service",
        getService: () => new CustomService(),
    });

    registry.registerCommand({
        name: "custom-service.go-to-previous-viewpoint",
        serviceId: "custom-service",
    });

    registry.registerCommand({
        name: "custom-service.push-viewpoint",
        serviceId: "custom-service",
    });

    registry.registerCommand({
        name: "custom-service.set-initial-viewpoint",
        serviceId: "custom-service",
    });
}
