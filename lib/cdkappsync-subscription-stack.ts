import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync';

export class CdkappsyncSubscriptionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLowerCase().replace('stack', '')
    
    // Dynamo Table
    
    const dynamo_table = new dynamodb.Table(this, "dynamo_table", {
      tableName: PREFIX_NAME + "-table",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
    
    // AppSync API

    const api = new appsync.GraphqlApi(this, "api", {
      name: PREFIX_NAME + "-api",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      schema: new appsync.Schema({
        filePath: "graphql/schema.graphql",
      }),
    })
    
    // AppSync Datasource and Resolver
    
    const dynamo_datasource = api.addDynamoDbDataSource(
      "dynamo_datasource",
      dynamo_table
    )

    dynamo_datasource.createResolver({
      typeName: "Query",
      fieldName: "listStocks",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    })

    dynamo_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addStock",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "mapping_template/add_stock.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })
    
    new cdk.CfnOutput(this, 'api_endpoint', { value: api.graphqlUrl })
    
    if (api.apiKey) {
      new cdk.CfnOutput(this, 'api_apikey', { value: api.apiKey })
    }

  }
}

