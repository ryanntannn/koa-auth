const koa = require("koa");
const uuid = require("uuid4");

function issueToken(opts = {}) {
  const { sign, aud, iss, tokenDuration = 300, strategies = [] } = opts;

  const strategyMap = Object.fromEntries(
    strategies.map((strategy) => [strategy.name, strategy])
  );

  /**
   * @param {koa.Context} ctx
   * @param {koa.Next} next
   */
  const handler = async function callback(ctx) {
    // get the strategy name from the request
    const strategyName = ctx.request.query.strategy;
    const grantType = ctx.request.query.grant_type;

    // get the strategy
    const strategy = strategyMap[strategyName];

    if (!strategy) {
      ctx.throw(400, `strategy not supported: ${strategyName}`);
    }

    // exchange the token for a profile based on the strategy
    const profile = await strategy.exchangeToken(ctx);

    //
    const payload = {
      jti: uuid(),
      sub: `${profile.id}`,
      aud,
      iss,
      grantType,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + tokenDuration,
    };

    // sign the token
    const token = sign(payload);

    ctx.body = {
      token,
    };
  };

  return handler;
}

module.exports = issueToken;
