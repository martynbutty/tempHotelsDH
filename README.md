# General
This is a hotels data hub project for CDK development with TypeScript. This project contains the main infrastructure for the supplier room type mapping. It currently includes:
* the api which will get hit by the Aggregation V2 endpoint that will contain all the needed data 
* the queue infrastructure that the api will push the data to. 

# Local Development
There are a couple of things you'll need to do to get set up for local development, below describes what's needed.

## Requirements
In order to start developing on this project you will need to have installed some software

* [Node](https://nodejs.org/en/download/) This will allow you to use all the necessary `npm` commands
* [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) This will help you install aws on your laptop, you will need it in order to deploy anything on aws and log in our platform. 
* [cdk-cli](https://github.com/aws/aws-cdk#getting-started) Here you can find a guide on how to install the aws-cdk cli which will be needed in order to work on the project.
* [Yawsso](https://onthebeach.blogin.co/posts/aws-cdk-multi-account-deploy-from-command-line-and-more-168769) This is a tool to help you automate and simplify copying the credentials for the CDK, you can follow the steps on this blog article on how to do it, we suggest you use the hotels-dev acount credentials instead of the flights-dev that this example is using.

## Development
The `cdk.json` file tells the CDK Toolkit how to execute your app. In this file you'll find the packages' configuration and also the variables for the hotels dev account which will be used for local development, these variables are used from the CDK implementation to deploy your local changes onto the OTB AWS account. You can also add different accounts and profiles in the file and depending which one you want to deploy to you can pass the variable name through the cli, examples for the hotels dev account will follow.

After following the `yawsso` guide above you'll have configured your aws SSO configuration and you'll be able to login by running this command

`yawsso login --profile hotels-dev`

When you'll want to synthesize the CloudFormation template you can run this command

`cdk synth -c ENV='hotels-dev' --profile hotels-dev`

In case you want to see the difference between the implementation that's currently deployed on the AWS account and your local changes you can run this command

`cdk diff -c ENV='hotels-dev' --profile hotels-dev`

You can also simply deploy your changes on the hotels-dev profile by running

`cdk deploy -c ENV='hotels-dev' --profile hotels-dev`

In case things haven't gone as planned you can always remove the infrastructure you deployed by running this command

`cdk destroy -c ENV='hotels-dev' --profile hotels-dev`

As you can see in every command we need to pass the environment and profile variable so our code and pick from the `cdk.json` which credentials to use. As mentioned before you can always add different accounts by adding the needed variables in the cdk file.

## Testing

In order to test the code you will need to run this command

`npm run test`

## Linting

In order to make sure your code is adhering to the code guidelines you can run the command

`npm run lint`
