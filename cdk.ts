import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dotenv from 'dotenv';
import * as iam from 'aws-cdk-lib/aws-iam';

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartServiceStack', {
  env: { region : process.env.AWS_REGION! },
});

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.AWS_REGION!,
    PG_HOST: process.env.PG_HOST!,
    PG_PORT: process.env.PG_PORT!,
    PG_DATABASE: process.env.PG_DATABASE!,
    PG_USERNAME: process.env.PG_USERNAME!,
    PG_PASSWORD: process.env.PG_PASSWORD!,
  },
  bundling: {
    externalModules: [
      'pg-native',
      'sqlite3',
      'pg-query-stream',
      'oracledb',
      'better-sqlite3',
      'tedious',
      'mysql',
      'mysql2',
      'class-transformer', 
      'class-validator',
    ],
  },
};

const cartApiLambda = new NodejsFunction(stack, 'CartApiLambda', {
    ...sharedLambdaProps,
    functionName: 'CartApi',
    entry: 'dist/src/main.js',
    handler: 'handler',
    timeout: cdk.Duration.seconds(10),
    initialPolicy: [
        new iam.PolicyStatement({
            actions: [
                'rds-db:connect',
                'rds-db:executeStatement',
            ],
            resources: [
                `arn:aws:rds:us-east-1:504137854779:db:database-1`,
            ],
        }),
    ],
  });


  const api = new apigateway.RestApi(stack, "CartApi", {
    restApiName: "Cart Service",
    description: "Cart Service",
    defaultCorsPreflightOptions: {
      allowHeaders: ["*"],
      allowOrigins: ["*"],
      allowMethods: [HttpMethods.GET, HttpMethods.PUT],
    },
    deployOptions: {
      stageName: "dev",
    },
  });

  const cartResource = api.root.addResource("{proxy+}", {
    defaultCorsPreflightOptions: {
      allowHeaders: ["*"],
      allowOrigins: ["*"],
      allowMethods: [HttpMethods.DELETE, HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT],
    },
  });

const cartIntegration = new apigateway.LambdaIntegration(cartApiLambda, {
    requestTemplates: { "application/json": '{ "statusCode": "200" }' }
});

cartResource.addMethod("POST", cartIntegration);

cartResource.addMethod("PUT", cartIntegration);

cartResource.addMethod("GET", cartIntegration);

cartResource.addMethod("DELETE", cartIntegration);
