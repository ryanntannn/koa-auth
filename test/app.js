"use strict";
const Koa = require("koa");
const Router = require("@koa/router");
const issueToken = require("../lib");
const jwtLib = require("jsonwebtoken");
const jwtGuard = require("../jwt");

const profile = {
  id: 123,
};

const app = new Koa();
const router = new Router();

// create the jwt guard middleware
const protected = jwtGuard({
  secret: "secret",
});

// define auth strategies
const passwordStrategy = {
  name: "corppass",
  async exchangeToken(ctx) {
    // insert validation logic here
    return profile;
  },
};

const dppStrategy = {
  name: "dpp",
  async exchangeToken(ctx) {
    // insert validation logic here
    return profile;
  },
};

// create the token issuer
const issuer = issueToken({
  sign: (payload) => jwtLib.sign(payload, "secret"),
  strategies: [
    passwordStrategy,
    dppStrategy,
    // add more strategies here
  ],
});

router
  // add `protected` middleware to protected routes
  .get("/", protected, (ctx) => {
    ctx.body = "protected\n";
  })
  .post("/token", issuer);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
