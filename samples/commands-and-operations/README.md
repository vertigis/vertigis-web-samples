# Commands and Operations

This sample demonstrates how to create a basic VertiGIS Studio Web Service that implements both a [command and operation](https://developers.geocortex.com/docs/web/configuration-commands-operations/). To learn more about creating services using the SDK, see our documentation in the [Developer Center](https://developers.geocortex.com/docs/web/sdk-services-overview/).

The [service in this sample](src/services/CustomService/CustomService.ts) implements a custom command and a custom operation. The command and operation are registered in the [entry point of the custom library](src/index.ts), which instructs VertiGIS Studio Web where to find the implementation when the command or operation is executed.

The command and operation is configured to execute from a menu in the [app config](app/app.json) of this sample.
