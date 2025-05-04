import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

import { Construct } from "constructs";

import * as path from "path";

export class S3CloudfrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3バケットの作成
    const reactBucket = new s3.Bucket(this, "react-bucket", {
      // スタック削除時にバケットも削除
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // バケット内のオブジェクトも自動削除
      autoDeleteObjects: true,
      // 直接アクセスをブロック
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // CloudFrontディストリビューションの作成
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(reactBucket),
        // HTTPSへのリダイレクト
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // キャッシュ設定
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // デフォルトルート
      defaultRootObject: "index.html",
    });

    // Reactアプリのビルドパスを指定
    const reactBuildPath = path.join(__dirname, "../../react-app/dist");

    // S3バケットにReactアプリをデプロイ
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(reactBuildPath)],
      destinationBucket: reactBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
