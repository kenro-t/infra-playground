#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPlaygroundStack } from "../lib/cdk-playground-stack";

const app = new cdk.App();
new CdkPlaygroundStack(app, "CdkPlaygroundStack", {
  env: { account: "816069168084", region: "ap-northeast-1" },
});
