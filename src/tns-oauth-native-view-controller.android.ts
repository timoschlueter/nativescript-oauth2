import { Application, Color, Frame } from "@nativescript/core";

import {
  TnsOAuthClient,
  ITnsOAuthTokenResult,
  TnsOAuthClientLogoutBlock,
} from "./index";
import { TnsOAuthClientLoginBlock } from "./index";
import {
  ITnsOAuthLoginController,
  TnsOAuthLoginSubController,
} from "./tns-oauth-login-sub-controller";

declare let android, global: any;

function getCustomTabsModule() {
  const androidxModule = global && global.androidx;
  if (
    androidxModule &&
    androidxModule.browser &&
    androidxModule.browser.customtabs
  ) {
    return androidxModule.browser.customtabs;
  }

  if (android && android.support && android.support.customtabs) {
    return android.support.customtabs;
  }

  return null;
}

export class TnsOAuthLoginNativeViewController
  implements ITnsOAuthLoginController {
  private loginController: TnsOAuthLoginSubController = null;

  public static initWithClient(client: TnsOAuthClient) {
    const instance = new TnsOAuthLoginNativeViewController();
    if (instance) {
      instance.loginController = new TnsOAuthLoginSubController(client);
    }
    return instance;
  }

  public loginWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  ) {
    const fullUrl = this.loginController.preLoginSetup(
      frame,
      urlScheme,
      completion
    );

    this.openUrlWithParametersCompletion(fullUrl, frame);
  }

  public logoutWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLogoutBlock
  ) {
    const fullUrl = this.loginController.preLogoutSetup(
      frame,
      urlScheme,
      completion
    );

    this.openUrlWithParametersCompletion(fullUrl, frame);
  }

  private openUrlWithParametersCompletion(fullUrl: string, frame: Frame): void {
    const customtabs = getCustomTabsModule();
    if (customtabs && customtabs.CustomTabsIntent) {
      const builder = new customtabs.CustomTabsIntent.Builder();
      builder.setToolbarColor(new Color("#335da0").android);
      builder.setShowTitle(true);
      const customTabsIntent = builder.build();
      customTabsIntent.launchUrl(
        Application.android.startActivity,
        android.net.Uri.parse(fullUrl)
      );
      return;
    }

    // Fallback for devices/runtimes without custom tabs classes.
    const intent = new android.content.Intent(
      android.content.Intent.ACTION_VIEW,
      android.net.Uri.parse(fullUrl)
    );
    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    Application.android.startActivity.startActivity(intent);
  }

  public resumeWithUrl(url: string): boolean {
    if (!!url) {
      return this.loginController.resumeWithUrl(
        url,
        (tokenResult: ITnsOAuthTokenResult, error) => {
          this.loginController.completeLoginWithTokenResponseError(
            tokenResult,
            error
          );
        }
      );
    } else {
      const er = "The login operation was canceled.";
      this.loginController.completeLoginWithTokenResponseError(null, er);
      return true;
    }
  }
}
