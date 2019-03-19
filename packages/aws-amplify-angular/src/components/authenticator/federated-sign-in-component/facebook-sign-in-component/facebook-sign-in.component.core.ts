// tslint:disable
/*
 * Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
// tslint:enable

import { Component, Input, OnInit  } from '@angular/core';
import { AmplifyService } from '../../../../providers';
import { constants, setLocalStorage } from '../../common'
import * as AmplifyUI from '@aws-amplify/ui';

const template = `
  <button id={{amplifyUI.facebookSignInButton}} class={{amplifyUI.signInButton}} variant="facebookSignInButton" (click)="onSignIn()">
    <span class={{amplifyUI.signInButtonIcon}}>
      <svg viewBox='0 0 279 538' xmlns='http://www.w3.org/2000/svg'><g id='Page-1' fill='none' fillRule='evenodd'><g id='Artboard' fill='#FFF'><path d='M82.3409742,538 L82.3409742,292.936652 L0,292.936652 L0,196.990154 L82.2410458,196.990154 L82.2410458,126.4295 C82.2410458,44.575144 132.205229,0 205.252865,0 C240.227794,0 270.306232,2.59855099 279,3.79788222 L279,89.2502322 L228.536175,89.2502322 C188.964542,89.2502322 181.270057,108.139699 181.270057,135.824262 L181.270057,196.89021 L276.202006,196.89021 L263.810888,292.836708 L181.16913,292.836708 L181.16913,538 L82.3409742,538 Z' id='Fill-1' /></g></g></svg>
    </span>
    <span class={{amplifyUI.signInButtonContent}} style="color: var(--color-white);">
        Sign In with Facebook
    </span>
  </button>
`

@Component({
  selector: 'amplify-auth-facebook-sign-in-core',
  template
})
export class FacebookSignInComponentCore implements OnInit  {
  @Input() facebookAppId: string;
  protected logger: any;
  amplifyUI: any;

  constructor(protected amplifyService: AmplifyService) {
    this.logger = this.amplifyService.logger('FacebookSignInComponent', 'INFO');
    this.amplifyUI = AmplifyUI
  }

  ngOnInit() {
    if (!this.amplifyService.auth() || 
      typeof this.amplifyService.auth().federatedSignIn !== 'function' || 
      typeof this.amplifyService.auth().currentAuthenticatedUser !== 'function') {
      this.logger.warn('No Auth module found, please ensure @aws-amplify/auth is imported');
    }

    if (this.facebookAppId && !(<any>window).FB) {
      this.createScript();
    }
  }

  async onSignIn() { 
    try {
      let response: any = await this.facebookLoginStatus();
      if (response.status !== 'connected') {
        response = await this.facebookLogin()
      }
      if (!response || !response.authResponse) {
        return;
      }

      const payload = { provider: constants.FACEBOOK };
      setLocalStorage(constants.AUTH_SOURCE_KEY, payload, this.logger);

      const me: any = await this.facebookApi('/me?fields=name,email');
      const { accessToken, expiresIn } = response.authResponse;
      const date = new Date();
      const expires_at = expiresIn * 1000 + date.getTime();
      if (!accessToken) {
          return;
      }
      const fbUser = {
        name: me.name, 
        email: me.email
      };

      await this.amplifyService.auth().federatedSignIn('facebook', {
        token: accessToken,
        expires_at
      }, fbUser);
      this.logger.debug(`Signed in with federated identity: ${constants.FACEBOOK}`);

      const user = await this.amplifyService.auth().currentAuthenticatedUser();
      this.amplifyService.setAuthState({ state: 'signedIn', user: user });
    } catch (error) {
      this.logger.error(error);
    }
  }

  facebookApi(uri: string) {
    const fb = (<any>window).FB;
    return new Promise((resolve: any) => {
      fb.api(uri, (response: any) => resolve(response))
    })
  }

  facebookLoginStatus() {
    const fb = (<any>window).FB;
    return new Promise((resolve: any) => {
      fb.getLoginStatus((response: any) => resolve(response))
    })
  }

  facebookLogin() {
    const fb = (<any>window).FB;
    const options = { scope: 'public_profile,email' }
    return new Promise((resolve: any, reject: any) => {
      fb.getLoginStatus((response: any) => resolve(response), options)
    })
  }

  fbAsyncInit() {
    this.logger.debug('init FB');
    const fb = (<any>window).FB;
    fb.init({
      appId   : this.facebookAppId,
      cookie  : true,
      xfbml   : true,
      version : 'v2.11'
    });
    fb.getLoginStatus((response: any) => this.logger.debug(response));
  }

  createScript() {
    const script = document.createElement('script');
    (<any>window).fbAsyncInit = this.fbAsyncInit.bind(this)

    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = () => console.debug('FB inited');
    document.body.appendChild(script);
  }
}