# Basic Service

This sample demonstrates how to create a basic VertiGIS Studio Web Service that implements a [custom command](https://developers.geocortex.com/docs/web/configuration-commands-operations/) to facilitate vehicle routing. To learn more about creating services using the SDK, see our documentation in the [Developer Center](https://developers.geocortex.com/docs/web/sdk-services-overview/).

The [service in this sample](src/services/RouteService/RouteService.ts) implements a custom command that adds a `SimpleMarkerSymbol` graphic to the map when clicked representing a _stop_ on the route, and uses a `RouteTask` to retrieve a vehicle route between the stops. The command is registered in the [entry point of the custom library](src/index.ts), which instructs VertiGIS Studio Web where to find the implementation when the command is executed.

The command is configured to execute in the [app config](app/app.json) of this sample as a result of a click on the map.
