# Setup

This requires [ngrok](https://ngrok.com/) (`brew cask install ngrok`) and
signing up for a free API key. Once you have your API key, run:

```
ngrok authtoken [my-auth-token]
```

To finish setup, using [Yarn](https://yarnpkg.com/), run:

```
yarn
```

# Development

In one Terminal tab, start ngrok:

```
yarn ngrok
```

And in another tab, start the development server:

```
yarn start
```

In your ngrok tab, you’ll see a URL that looks like `https://[hash].ngrok.io`.
That’s the URL you can load up from your desktop or phone, rather than the
usual `localhost`.
