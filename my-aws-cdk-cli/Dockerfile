FROM node:22-slim
# ワークディレクトリを設定
WORKDIR /app
# AWS CDKをグローバルにインストール
RUN npm install -g aws-cdk
# エントリーポイントを設定
ENTRYPOINT ["npx", "cdk"]
