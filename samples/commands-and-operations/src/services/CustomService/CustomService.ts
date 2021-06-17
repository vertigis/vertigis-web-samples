import { ServiceBase } from "@vertigis/web/services";
import { AlertCommandArgs } from "@vertigis/viewer-spec/messaging/registry/ui";
import { command, operation, canExecute } from "@vertigis/web/messaging";

export default class CustomService extends ServiceBase {
    private _history: string[] = [];
    private _canExecuteCustomAlertCommand = false;

    @command("custom-service.send-message")
    protected _handleSendMessage(message: string): void {
        this._history.push(message);
    }

    @operation("custom-service.get-message-history")
    protected _handleGetMessageHistory(): AlertCommandArgs {
        return {
            title: "Command History",
            message: JSON.stringify(this._history, null, 2),
        };
    }

    @command("custom-service.toggle-can-execute")
    protected async _handleToggleCanExecute(): Promise<void> {
        this._canExecuteCustomAlertCommand =
            !this._canExecuteCustomAlertCommand;
        await this.messages
            .command("custom-service.command-with-can-execute")
            .canExecuteChanged.publish();
    }

    @canExecute("custom-service.command-with-can-execute")
    protected _canExecuteCommandWithCanExecute(): boolean {
        return this._canExecuteCustomAlertCommand;
    }

    @command("custom-service.command-with-can-execute")
    protected async _handleCommandWithCanExecute(): Promise<void> {
        await this.messages.commands.ui.alert.execute({
            message: "It worked!",
        });
    }
}
