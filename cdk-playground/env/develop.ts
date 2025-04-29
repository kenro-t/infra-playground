// TODO: 書き方を変えてdevだけの設定にし、他の環境は別ファイルにする

// ECSサービスキャパシティ
export const servicceCapacityProviderStrategies = {
  develop: [
    // スポット
    {
      capacityProvider: "FARGATE_SPOT",
      weight: 2,
      base: 1, // 常に起動する数
    },
    // オンデマンド
    {
      capacityProvider: "FARGATE",
      weight: 0,
      base: 0,
    },
  ],
  production: [
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
