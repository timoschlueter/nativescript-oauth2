// Load NativeScript + Angular polyfills (includes Zone.js) before bootstrap.
import "./polyfills";
import "@angular/compiler";
import { platformNativeScriptDynamic } from "@nativescript/angular";

import { AppModule } from "./app/app.module";
import { configureOAuthProviders } from "./app/auth-providers-helper";

// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object.

configureOAuthProviders();

platformNativeScriptDynamic().bootstrapModule(AppModule);
