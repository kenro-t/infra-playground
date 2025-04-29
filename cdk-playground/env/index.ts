import { config as developConfig } from "./develop";
import { config as productionConfig } from "./production";

const env = process.env.APP_ENV || "develop";

export const config = env === "production" ? productionConfig : developConfig;
