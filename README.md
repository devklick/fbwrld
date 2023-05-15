<h1 align="center">
    FbWrld
</h1>

<p align="center">
    A fullstack football application
</p>
<br/>
<br/>
<br/>
<br/>

> **Warning**  
This is very much WIP

# Deploying the stack locally

This application makes use of [Serverless](https://www.serverless.com/) and [LocalStack](https://localstack.cloud/). As such, you can deploy and run the entire stack locally. 

## Prerequisites
- Make sure you have the [LocalStack CLI](https://docs.localstack.cloud/getting-started/installation/#localstack-cli) installed.
- Make sure you have the [Serverless CLI](https://www.serverless.com/framework/docs/getting-started) installed.
- [Optional] Install the [LocalStack AWS CLI](https://github.com/localstack/awscli-local) (aka `awslocal`).

## Clone and install

Obviously, you'll need to clone the repo and install the npm package.

```
git clone https://github.com/devklick/fbwrld
cd fbwrld
npm i 
```

## Starting LocalStack

Assuming you have the LocalStack CLI set up, you can run the following in a terminal to start the LocalStack environment.

```
localstack start
```
It's best to keep this open in a separate terminal so you can refer to it later. Some useful logs get printed here.

## Deploying the stack

With the LocalStack environment now running, we can run the following in a new terminal window/tab and the Serverless CLI will orchestrate the deployment of our stack to the LocalStack environment:

```
serverless deploy --stage local
```

While the stack is being deployed, you should see information being printed to the LocalStack CLI terminal to let you know the progress of the deployment.
