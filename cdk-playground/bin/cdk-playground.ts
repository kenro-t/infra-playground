import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/stacks/network";
import { CdkPlaygroundStack } from "../lib/stacks/cdk-playground";

const app = new cdk.App();

new NetworkStack(app, "NetworkStack", {});

new CdkPlaygroundStack(app, "CdkPlaygroundStack", {});
