# VertiGIS Studio Web embedded in iframe

This sample demonstrates how to embed VertiGIS Studio Web within another application. This can be extremely useful for integrating with other systems and applications to create powerful integration use cases.

In this example we didn't create any custom code using the VertiGIS Studio Web SDK, as it may not be required in all cases. However, using the Web SDK can allow you to create a highly flexible translation layer to bridge the communication between VertiGIS Studio Web and other applications.

The [parent HTML page in this sample](app/parent.html) shows an example of embedding VertiGIS Studio Web within another application. It subscribes to [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) events from the VertiGIS Studio Web frame, as well as sends `postMessage` events to VertiGIS Studio Web when clicking on buttons within the parent page.

The [app config in this sample](app/app.json) configures the application to support `postMessage`. By default, VertiGIS Studio Web will not send or receieve `postMessage` events unless explicitly configured to do so. The app config also configures a menu item to invoke the `viewer.post-message` command which will send the input argument of the command to the parent frame.

**WARNING: You should explicitly configure the `postMessageAllowedOrigin` setting in your app config to the specific origin URL of the application you are integrating with. We've used `*` to simplify the demonstration of this sample, but you should always specify a specific URL for `postMessageAllowedOrigin`, not `*`, if you know where the other window's document should be located. Failing to provide a specific origin discloses the data you send to any interested malicious site.** To learn more see the [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns) documentation.
