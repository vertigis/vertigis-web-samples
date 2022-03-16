import { ServiceBase } from "@vertigis/web/services";
import { command, MapsLike, ViewpointLike } from "@vertigis/web/messaging";

export default class CustomService extends ServiceBase {
    private _history: ViewpointLike[] = [];
    private skipSaveNextViewpoint = false;

    @command("custom-service.push-viewpoint")
    protected _handlePushViewpoint(args: {
        maps: MapsLike;
        viewpoint: ViewpointLike;
    }): void {
        // Don't update the history if the reason the viewpoint changed was our
        // `goToPreviousViewPoint` command
        if (!this.skipSaveNextViewpoint) {
            this._history.push(args.viewpoint);
        }
        this.skipSaveNextViewpoint = false;
    }

    @command("custom-service.go-to-previous-viewpoint")
    protected async _handleGoToPreviousViewpoint(): Promise<void> {
        // TODO: Remove casting once 5.17 is shipped
        const currentViewpoint: {
            maps: MapsLike;
            viewpoint: ViewpointLike;
        } = (await this.messages.operations.map.getViewpoint.execute()) as any as {
            maps: MapsLike;
            viewpoint: ViewpointLike;
        };
        let _previousViewpoint = this._history.pop();
        // The last viewpoint on the stack may be the current viewpoint as the
        // viewpoint is pushed after the map's viewpoint has changed.
        if (
            _previousViewpoint &&
            currentViewpoint.viewpoint === _previousViewpoint
        ) {
            _previousViewpoint = this._history.pop();
        }
        if (_previousViewpoint) {
            await this.messages.commands.map.goToViewpoint.execute(
                _previousViewpoint
            );
        } else {
            // If we don't have anymore viewpoints, go back to the initial viewpoint
            await this.messages.commands.map.goToInitialViewpoint.execute();
        }
        this.skipSaveNextViewpoint = true;
    }
}
