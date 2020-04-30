import { ServiceBase } from "@geocortex/web/services";
import { AlertCommandArgs } from "@geocortex/viewer-framework/messaging/registry/ui";

export interface DoActionArgs {
    value: string;
}

export default class CustomService extends ServiceBase {
    history: string[] = [];

    protected _handleSendMessage(args: DoActionArgs) {
        console.log(`Executing custom command with value "${args.value}"`);
        this.history.push(args.value);
    }

    protected _getCommandHistory(): AlertCommandArgs {
        return {
            title: "Command History",
            message: JSON.stringify(this.history, null, 2),
        };
    }
}
