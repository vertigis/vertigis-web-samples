import { ServiceBase } from "@vertigis/web/services";
import { command, MapsLike, ViewpointLike } from "@vertigis/web/messaging";

const EXTENT_KEY = "vertigis_web_extent_key";

export default class CustomService extends ServiceBase {
    private _history: ViewpointLike[] = [];
    private _skipSaveNextViewpoint = false;

    @command("custom-service.push-viewpoint")
    protected _handlePushViewpoint(args: {
        maps: MapsLike;
        viewpoint: ViewpointLike;
    }): void {
        // Don't update the history if the reason the viewpoint changed was our
        // `goToPreviousViewPoint` command
        if (!this._skipSaveNextViewpoint) {
            this._history.push(args.viewpoint);
        }
        this._skipSaveNextViewpoint = false;
        window.localStorage.setItem(EXTENT_KEY, JSON.stringify(args.viewpoint));
    }

    @command("custom-service.set-initial-viewpoint")
    protected async _setInitialViewpoint(): Promise<void> {
        const lastViewpoint = localStorage.getItem(EXTENT_KEY);
        if (lastViewpoint) {
            await this.messages.commands.map.goToViewpoint.execute(
                JSON.parse(lastViewpoint)
            );
        }
    }

    @command("custom-service.go-to-previous-viewpoint")
    protected async _handleGoToPreviousViewpoint(): Promise<void> {
        const currentViewpoint =
            await this.messages.operations.map.getViewpoint.execute();
        let previousViewpoint = this._history.pop();
        // The last viewpoint on the stack may be the current viewpoint as the
        // viewpoint is pushed after the map's viewpoint has changed.
        if (
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
        this._skipSaveNextViewpoint = true;
    }
}
