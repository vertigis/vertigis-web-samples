# Icons Pack

This sample demonstrates how to integrate a 3rd party icon pack into your application. To learn more about adding icons to your application see our documentation in the [Developer Center](https://developers.vertigisstudio.com/docs/web/sdk-adding-icons/).

The [component in this sample](src/components/IconList/IconList.tsx) uses the IconRegistry to display the icons that were registered in the [entry point of the custom library](src/index.ts).

This sample also demonstrates an icon registration pattern where the Icon pack is enumerated and a custom [registrationIcons.ts](src/_support_/registrationIcons.ts) file is generated and referenced by the main [entry point of the custom library](src/index.ts). See the pipeline [registrationIcons.ts](pipeline/registrationIcons.ts) file to see how this is done.
