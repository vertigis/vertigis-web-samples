# Internationalization

This sample demonstrates how to internationalize your application to be supported in multiple locales. To learn more about internationalizing your application, see our documentation in the [Developer Center](https://developers.geocortex.com/docs/web/sdk-internationalization).

The [component in this sample](src/components/TranslatableText/TranslatableText.tsx) uses language strings which are translated at runtime based on the values that were registered in the [entry point of the custom library](src/index.ts).

By default, Geocortex Web will detect the locale of the current device and display the content of the application in that locale if possible. To override the locale used by the application, you can add the `locale` URL parameter to force a specific locale. For example to load this sample in the `de` locale (German), add `?locale=de` to the URL like so:

```
/i18n?locale=de
```

We recommend using the React components provided by the Geocortex Web React UI library wherever possible as demonstrated in this sample. Using these components ensures that the styling and behavior matches the rest of the application, and also takes care of translating language string keys to the corresponding value depending on the current locale automatically!
