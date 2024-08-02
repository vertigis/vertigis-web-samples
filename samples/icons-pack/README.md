# Icons Pack

This sample demonstrates how to integrate a 3rd party icon pack into your application. To learn more about adding icons to your application see our documentation in the [Developer Center](https://developers.vertigisstudio.com/docs/web/sdk-adding-icons/).

The [component in this sample](src/components/IconList/IconList.tsx) uses the IconRegistry to display the icons that were registered in the [entry point of the custom library](src/index.ts).

This sample also demonstrates an icon registration pattern where the icon files are enumerated and a custom [registerIcons.ts](src/_support/registerIcons.ts) file is generated and referenced by the main [entry point of the custom library](src/index.ts).

To create new custom icons you can add your own files to the `svg` directory. You can further customize the process by adding or removing folders and libraries that are processed, by updating line 21 in the [registerIcons.mts](pipeline/registerIcons.mts) file. You can then run the prepare task 'yarn prepare' to register the new files.
