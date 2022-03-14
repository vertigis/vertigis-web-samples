import { ServiceBase } from "@vertigis/web/services";
import { command, MapsLike, ViewpointLike } from "@vertigis/web/messaging";

export default class CustomService extends ServiceBase {
    private _history: ViewpointLike[] = [];
    private movedBecauseCommand = false;

    @command("custom-service.push-viewpoint")
    protected _handlePushViewpoint(args: {
        maps: MapsLike;
        viewpoint: ViewpointLike;
    }): void {
        // Don't update the history if the reason the viewpoint changed was our
        // `goToPreviousViewPoint` command
        if (!this.movedBecauseCommand) {
            this._history.push(args.viewpoint);
        }
        this.movedBecauseCommand = false;
    }

    @command("custom-service.go-to-previous-viewpoint")
    protected async _handleGoToPreviousViewpoint(): Promise<void> {
        const currentViewpoint: {
            maps: MapsLike;
            viewpoint: ViewpointLike;
        } = (await this.messages.operations.map.getViewpoint.execute()) as any as {
            maps: MapsLike;
            viewpoint: ViewpointLike;
        };
        let previousViewpoint = this._history.pop();
        while (
            previousViewpoint &&
            currentViewpoint.viewpoint === previousViewpoint
        ) {
            previousViewpoint = this._history.pop();
        }
        if (previousViewpoint) {
            await this.messages.commands.map.goToViewpoint.execute(
                previousViewpoint
            );
        } else {
            // If we don't have anymore viewpoints, go back to the initial viewpoint
            await this.messages.commands.map.goToInitialViewpoint.execute();
        }
        this.movedBecauseCommand = true;
    }
}
