import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";

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
  }
}
