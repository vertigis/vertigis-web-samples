import { ServiceBase } from "@geocortex/web/services";
import { AlertCommandArgs } from "@geocortex/viewer-framework/messaging/registry/ui";

export default class CustomService extends ServiceBase {
    private _history: string[] = [];
    private _canExecuteCustomAlertCommand = false;

    protected _handleSendMessage(message: string): void {
        this._history.push(message);
    }

    protected _handleGetMessageHistory(): AlertCommandArgs {
        return {
            title: "Command History",
            message: JSON.stringify(this._history, null, 2),
        };
    }

    protected _handleToggleCanExecute(): void {
        this._canExecuteCustomAlertCommand = !this
            ._canExecuteCustomAlertCommand;
        this.messages
            .command("custom-service.command-with-can-execute")
            .canExecuteChanged.publish();
    }

    protected _canExecuteCommandWithCanExecute(): boolean {
        return this._canExecuteCustomAlertCommand;
    }

    protected _handleCommandWithCanExecute(): void {
        this.messages.commands.ui.alert.execute({
            message: "It worked!",
        });
    }
}
