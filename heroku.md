# Guide: Deploying a Node.js Project to Heroku from Bitbucket

## Prerequisites

- Ensure you have the Heroku CLI installed on your machine.
- Make sure your project has a `package.json` file with all the required dependencies.

# You can Install Heroku Cli Using this command

```bash
brew tap heroku/brew && brew install heroku
```

## Step 1: Log in to Heroku

```bash
heroku login
```

This will open a web browser where you can log in with your Heroku account credentials.

# Step 2: Create a Heroku App

```bash
heroku create your-app-name
```

Replace **your-app-name** with the desired name for your Heroku app. The app name should be unique on Heroku.

# Step 3: Set Up Environment Variables

**STRIPE_API_SECRET_KEY:** This is a configuration variable that holds the secret API key for Stripe. It is used to authenticate requests made to the Stripe API on behalf of your application.

**VUE_APP_API_BASE_URL_V1:** This is the configuration variable representing the actual backend URL where your application is deployed. It serves as the endpoint for communication between your Vue.js application and the backend server.

```bash
heroku config:set VUE_APP_STRIPE_KEY=your_actual_stripe_api_secret_key
heroku config:set VUE_APP_API_BASE_URL_V1=your_actual_api_url_where_you_deployed_you_backend
```

# Step 4: Push to Heroku

```bash
git push heroku main
```

This will deploy your project to Heroku and trigger the build process.
Replace **main** with the correct branch name if your main branch has a different name.


# Step 5: Verify the Deployment

```bash
heroku open
```

This will open your app in a new browser tab.
