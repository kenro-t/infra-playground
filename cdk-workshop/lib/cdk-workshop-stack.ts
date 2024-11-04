import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// ec2 に関するパッケージを import
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from 'aws-cdk-lib/aws-rds';
import { readFileSync } from 'fs';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPCの宣言
    const vpc = new ec2.Vpc(this, "BlogVpc", {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    });

    // EC2インスタンスの宣言
    const webServer1 = new ec2.Instance(this, 'WordpresServer1', {
      // 対応するVPC
      vpc: vpc,
      // 対応するインスタンスタイプ
      instanceType:ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      // AMI
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      // サブネットの指定
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC}
    });

    // user-dataの読込
    const script = readFileSync("./lib/resources/user-data.sh", "utf8");
    // EC2にuser-dataを追加
    webServer1.addUserData(script);

    // port80, 全ての IP アドレスからのアクセスを許可
    webServer1.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    // EC2 インスタンスアクセス用の IP アドレスを出力
    new CfnOutput(this, "WordpressServer1PublicIPAddress", {
      value: `http://${webServer1.instancePublicIp}`,
    });

    // RDSインスタンスの宣言
    const rdsServer1 = new rds.DatabaseInstance(this, 'WordpressRds', {
      vpc: vpc,
      engine: rds.DatabaseInstanceEngine.mysql({ version:rds.MysqlEngineVersion.VER_8_0_39 }),
      databaseName: "wordpress"
    });
    // webServer1からの接続を許可
    rdsServer1.connections.allowDefaultPortFrom(webServer1);
  }
}
