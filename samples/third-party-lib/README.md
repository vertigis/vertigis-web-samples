# 3rd-Party Library

This sample demonstrates how to install and import 3rd-party [npm](https://www.npmjs.com/) packages. In this sample we've installed the [`react-force-graph`](https://github.com/vasturiano/react-force-graph) package as a [project dependency](package.json) of this sample to visualize fire hydrant surveys.

The [layout](app/layout.xml) includes a button that has a configured [command chain](https://developers.geocortex.com/docs/web/configuration-commands-operations/#command-chains) in the [app config](app/app.json), which includes a custom command implemented in the [model in this sample](src/components/ThreeDimensionalGraph/ThreeDimensionalGraphModel.ts).

Clicking on a survey node in the 3d graph view will display the fire hydrant survey details using the [`results.display-details`](https://developers.geocortex.com/docs/web/api-commands-operations-events#command-results.display-details) command. The hydrants are highlighted on the Geocortex Map by using the [`highlights.*`](https://developers.geocortex.com/docs/web/api-commands-operations-events#command-highlights.add) commands.
