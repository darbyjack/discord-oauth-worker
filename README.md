# Discord OAuth Worker

This is a simple Discord OAuth2 Cloudflare Worker that allows a user to authenticate with Discord, get the user information and add the user to a Discord server using Discord's API.

## Prerequisites
* Node.js and npm/yarn/pnpm installed on your system.
* A Discord account and a Discord server.
* A Discord application with the necessary permissions to add users to a server.

## Installation

1. Clone the repository to your local machine.

```bash
git clone https://github.com/darbyjack/discord-oauth-worker
```

2. Navigate to the project directory and install the dependencies.

```bash
cd discord-oauth-worker
npm/yarn/pnpm install
```

3. Navigate to `src/config.ts` and fill in the necessary information.
* `client_id`: Your Discord application's client ID.
* `redirect_url`: The URL that Discord will redirect the user to after successful authentication.
* `scopes`: The scopes you would like to request from the user.
* `guild_id`: The ID of the Discord server that you want to add the user to.

4. Start the worker.

```bash
pnpm start
```

## Usage

1. Navigate to http://localhost:8787 in your browser to start the authentication process.
2. The user will be redirected to Discord's authentication page.
3. After successful authentication, the user will be redirected back to the `redirect_url` specified in the `config.ts` file.
4. The user's information and access token will be retrieved and the user will be added to the Discord server specified in the `config.ts` file.
5. The user will be redirected to the /success endpoint, where they will see a "Success!" message.

## Deployment

To deploy this project to Cloudflare Workers run

```bash
  npm/yarn/pnpm run deploy
```


## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request. All contributions are welcome!
