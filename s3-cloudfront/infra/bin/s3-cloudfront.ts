#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3CloudfrontStack } from '../lib/s3-cloudfront-stack';

const app = new cdk.App();
new S3CloudfrontStack(app, 'S3CloudfrontStack', {
  env: { account: "MyAccount", region: "ap-northeast-1" },
});