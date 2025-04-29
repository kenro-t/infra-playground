export const config = {
  // ECSサービスキャパシティ
  servicceCapacityProviderStrategies: [
    // スポット
    {
      capacityProvider: "FARGATE_SPOT",
      weight: 2,
      base: 1, // 常に起動する数
    },
    // オンデマンド
    {
      capacityProvider: "FARGATE",
      weight: 1,
      base: 1,
    },
  ],
};
