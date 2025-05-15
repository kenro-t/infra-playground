#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPlaygroundStack } from "../lib/stack/cdk-playground-stack";

const app = new cdk.App();
new CdkPlaygroundStack(app, "CdkPlaygroundStack", {
  env: { account: "MyAccount", region: "ap-northeast-1" },
});
