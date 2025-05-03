import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";

import { Construct } from "constructs";

export class FargateTaskDefinition {
  public taskDefinition: ecs.FargateTaskDefinition;

  constructor() {}

  public createResources(scope: Construct) {
    // タスク定義の作成
    this.taskDefinition = new ecs.FargateTaskDefinition(
      scope,
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
    this.taskDefinition.addFirelensLogRouter("firelens-log-router", {
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
          aws_fluent_bit_init_s3_1: "extra.conf",
        },
        logging: ecs.LogDriver.awsLogs({
          streamPrefix: "fluentbit-",
        }),
      });
  
      // コンテナの追加
      const mainContainer = this.taskDefinition.addContainer("MyContainer", {
        image: ecs.ContainerImage.fromRegistry("nginx"),
        logging: new ecs.FireLensLogDriver({}),
      });
  
      // mainContainerをデフォルトコンテナとする
      this.taskDefinition.defaultContainer = mainContainer;
  }
}
