# Find the ISS

WebAR proof-of concept lovingly made by Envy Labs.

🚀 https://envylabs.github.io/find-the-iss/

### Requirements

- iOS 11 Safari
- Chrome for Android (unless it’s really old)

# Setup

This requires [ngrok](https://ngrok.com/) (`brew cask install ngrok`) and
signing up for a free API key. Once you have your API key, run:

```
ngrok authtoken [my-auth-token]
```

You only have to run this once. To finish setup, using [Yarn](https://yarnpkg.com/), run:

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

# Deployment

Deployment uses AWS. To deploy to production, first install
[aws-cli](https://github.com/aws/aws-cli):

```
brew install awscli
```

Then configure with the **MadeWithEnvySiteUploader** credentials from 1Password

```
aws configure
AWS Access Key ID: [your access key]
AWS Secret Access Key: [your secret access key]
```

```
yarn build
yarn deploy
```

…

¯\\_(ツ)_/¯
