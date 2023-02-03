import { Context, Hono } from "hono";
import { cryptoRandomStringAsync } from "crypto-random-string";
import config from "./config";

interface Env {
  CLIENT_SECRET: string;
  BOT_TOKEN: string;
}

const app = new Hono<{ Bindings: Env }>();

const BASE_URL = "https://discord.com";

async function generate_url(clientId: string, redirect: string, scope: string): Promise<string> {
  const state = await cryptoRandomStringAsync({ length: 12 });
  return `${BASE_URL}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=${scope}&state=${state}`;
}

async function initialize(code: string, context: Context<any>): Promise<string> {
  const url = `${BASE_URL}/api/oauth2/token`;
  const data = {
    client_id: config.client_id,
    client_secret: context.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: config.redirect_url,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data).toString(),
  });

  const results: any = await response.json();
  const access_token = results.access_token;
  return access_token;
}

async function getUser(token: string): Promise<any> {
  const url = `${BASE_URL}/api/users/@me`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

async function joinGuild(token: string, userId: string, context: Context<any>) {
  const url = `${BASE_URL}/api/guilds/${config.guild_id}/members/${userId}`;
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${context.env.BOT_TOKEN}`,
    },
    body: JSON.stringify({ access_token: token }),
  });
}

app.get("/", async (c) => {
	return c.redirect(await generate_url(config.client_id, config.redirect_url, config.scopes));
});

app.get("/login", async (c) => {
  const { code } = c.req.query();
  const access_token = await initialize(code, c);
  const user = await getUser(access_token);
  await joinGuild(access_token, user.id, c);
  return c.redirect("/success");
});

app.get("/success", async (c) => {
  return c.text("Success!");
});

export default app;
