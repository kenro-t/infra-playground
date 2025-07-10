#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPlaygroundStack } from "../lib/stacks/cdk-playground";

const app = new cdk.App();
new CdkPlaygroundStack(app, "CdkPlaygroundStack", {});
