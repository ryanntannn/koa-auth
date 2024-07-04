// Type definitions for koa-jwt 2.x
// Project: https://github.com/koajs/jwt
// Definitions by: Bruno Krebs <https://github.com/brunokrebs/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import Koa = require("koa");

export = issueToken;

declare function issueToken(
  options?: issueToken.Options
): issueToken.Middleware;

declare namespace issueToken {
  interface Options {
    sign?: (payload: Payload) => string;
    aud?: string;
    iss?: string;
    tokenDuration?: number;
    strategies?: Strategy[];
  }

  interface Payload {
    jti: string;
    sub: string;
    aud?: string;
    iss?: string;
    grantType: string;
    iat: number;
    exp: number;
  }

  interface Profile {
    id: string;
  }

  interface Strategy {
    name: string;
    /**
     * The function that will be called to exchange the token for a user.
     */
    tokenExchange: (ctx: Koa.Context) => Promise<Profile>;
  }

  export interface Middleware extends Koa.Middleware {}
}
