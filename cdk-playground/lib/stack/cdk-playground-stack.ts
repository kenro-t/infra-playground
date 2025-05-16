import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import * as path from "path";

import { Construct } from "constructs";
import { config } from "../../env";
import { FargateTaskDefinition } from "../resources/fargate-task-definition";

export class CdkPlaygroundStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 環境毎の変数。実際には環境変数として埋め込まれたものを利用。
    const APP_ENV = process.env.APP_ENV || "develop";

    // TODO: VPCやサブネットまで用意して疎通まで確認する
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const subnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    });

    const securityGroup = new ec2.SecurityGroup(this, "MySecurityGroup", {
      vpc,
      allowAllOutbound: true,
      description: "My security group",
      securityGroupName: "MySecurityGroup",
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic from anywhere"
    );

    // S3バケットの作成
    const myBucket = new s3.Bucket(this, "MyBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // スタック削除時にバケットも削除（開発用）
      autoDeleteObjects: true, // バケット削除時に中身も削除（開発用）
    });

    // const myLambda = new lambda.Function(this, "MyLambda", {
    //   functionName: "MyLambda",
    //   runtime: lambda.Runtime.NODEJS_22_X,
    //   architecture: lambda.Architecture.ARM_64,
    //   handler: "index.handler",
    //   code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/')),
    //   vpcSubnets: {
    //     subnets: subnet.subnets,
    //   },
    //   vpc,
    //   securityGroups: [securityGroup],
    // });

    

    // NodejsFunctionを使用してLambda関数を作成
    // NodejsFunctionは、TypeScriptで書かれたLambda関数を自動的にコンパイルしてデプロイする。
    const myLambda = new NodejsFunction(this, "MyLambda", {
      entry: path.join(__dirname, "../../lambda/index.ts"), // tsファイルを直接指定
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      vpcSubnets: {
        subnets: subnet.subnets,
      },
      vpc,
      securityGroups: [securityGroup],
      bundling: {
        
      }
    });

    myBucket.grantReadWrite(myLambda); // LambdaにS3バケットへの読み書き権限を付与


    const myLambdaUrl = new lambda.FunctionUrl(this, "MyLambdaUrl", {
      function: myLambda,
      authType: lambda.FunctionUrlAuthType.NONE, // 認証なしで公開
      cors: {
        allowedMethods: [lambda.HttpMethod.GET],
        allowedHeaders: ["*"],
        allowedOrigins: ["*"], // 必要に応じて制限
      },
    });

    /*
    // クラスターの作成
    const cluster = new ecs.Cluster(this, "MyCluster", {
      clusterName: "MyCluster",
    });

    const myFargateTaskDefinition = new FargateTaskDefinition();
    myFargateTaskDefinition.createResources(this);

    // サービスの作成
    const myFargateService = new ecs.FargateService(this, "MyFargateService", {
      cluster,
      taskDefinition: myFargateTaskDefinition.taskDefinition,
      desiredCount: 1,
      capacityProviderStrategies: config.servicceCapacityProviderStrategies,
      assignPublicIp: true,
      // vpcSubnets: subnet,
      serviceName: "MyFargateService",
    });
*/
  }
}
