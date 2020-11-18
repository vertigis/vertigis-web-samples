# Integrating ArcGIS JavaScript 4.x API Widgets

This sample demonstrates how to integrate an existing [ArcGIS JavaScript API 4.x widget](https://developers.arcgis.com/javascript/latest/sample-code/intro-widgets/index.html) in your application by wrapping the widget in a Geocortex Web component.

In this sample we've wrapped the [Daylight widget](https://developers.arcgis.com/javascript/latest/sample-code/widgets-daylight/index.html) to control the time of day in the 3D scene view. The [EsriMapWidget.tsx](src/components/Daylight/EsriMapWidget.tsx) module is a [higher-order component](https://reactjs.org/docs/higher-order-components.html) that contains the logic to handle the lifecycle of the ArcGIS widget.
