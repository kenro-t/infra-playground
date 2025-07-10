import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class NetworkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
      subnetConfiguration: [
        // ALBやNLBを配置するサブネット
        {
          cidrMask: 24,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        // アプリケーション用のサブネット
        {
          cidrMask: 24,
          name: "private",
          // PRIVATE_WITH_EGRESSはNAT経由でインターネットアクセス可能
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        // DBやキャッシュ用のサブネット
        {
          cidrMask: 24,
          name: "isolated",
          // PRIVATE_ISOLATEDはNAT経由でインターネットアクセス不可
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Select public subnets
    const publicSubnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    });

    // Select private subnets with egress
    const privateSubnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    });

    // Select isolated subnets
    const isolatedSubnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    });

    // Outputs for the VPC
    new cdk.CfnOutput(this, "VpcId", {
      value: vpc.vpcId,
      description: "The ID of the VPC",
    });

    // Outputs for the public subnets
    new cdk.CfnOutput(this, "PublicSubnetIds", {
      value: publicSubnet.subnetIds.join(", "),
      description: "The IDs of the public subnets",
    });

    // Outputs for the private subnets
    new cdk.CfnOutput(this, "PrivateSubnetIds", {
      value: privateSubnet.subnetIds.join(", "),
      description: "The IDs of the private subnets",
    });
  }
}
