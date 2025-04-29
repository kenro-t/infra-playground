import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";

import { Construct } from "constructs";
import { servicceCapacityProviderStrategies } from "../../env/develop";


export class CdkPlaygroundStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 環境毎の変数。実際には環境変数として埋め込まれたものを利用。
    const APP_ENV = "develop";

    // TODO: VPCやサブネットまで用意して疎通まで確認する

    // クラスターの作成
    const cluster = new ecs.Cluster(this, "MyCluster", {
      clusterName: "MyCluster",
    });

    // タスク定義の作成
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "MyTaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        },
      }
    );

    // firelensサイドカーコンテナの追加
    taskDefinition.addFirelensLogRouter("firelens-log-router", {
      firelensConfig: {
        type: ecs.FirelensLogRouterType.FLUENTBIT,
        options: {
          enableECSLogMetadata: false,
        },
      },
      image: ecs.ContainerImage.fromRegistry(
        "public.ecr.aws/aws-observability/aws-for-fluent-bit:init-latest"
      ),
      environment: {
        // aws_fluent_bit_init_s3_1: "extra.conf", // TODO: 後で指定する
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "fluentbit-",
      }),
    });

    // コンテナの追加
    const mainContainer = taskDefinition.addContainer("MyContainer", {
      image: ecs.ContainerImage.fromRegistry("nginx"),
      logging: new ecs.FireLensLogDriver({}),
    });

    // mainContainerをデフォルトコンテナとする
    taskDefinition.defaultContainer = mainContainer;

    
    // サービスの作成
    const myFargateService = new ecs.FargateService(this, "MyFargateService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      capacityProviderStrategies: servicceCapacityProviderStrategies[APP_ENV],
      assignPublicIp: true,
      // vpcSubnets: subnet,
      serviceName: "MyFargateService",
    });
  }
}
