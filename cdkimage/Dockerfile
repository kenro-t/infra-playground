# FROM node:22.13.1

# # 基本パッケージとAWS CLI v2のインストール
# RUN apt-get update && \
#     apt-get install -y unzip && \
#     curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
#     unzip awscliv2.zip && \
#     ./aws/install && \
#     rm -rf awscliv2.zip aws

# # AWS CDKのグローバルインストール
# RUN npm install -g aws-cdk@latest

# # 設定確認用コマンド
# RUN aws --version && cdk --version

# # ENTRYPOINT [ "cdk" ]

# # docker run -it --rm \
# #   -v /$HOME/.aws:/root/.aws \
# #   -v $(pwd -W):/workspace -w //workspace \
# #   --entrypoint=cdk \
# #   cdk-test:latest \
# #   $* init sample-app --language typescript


#   # docker run -it --rm \
#   # cdk-test:latest \
#   # $* init sample-app --language typescript


#   docker run -it --rm \
#   -v /$HOME/.aws:/root/.aws \
#   -v /$(pwd -W):/workspace:delegated \
#   -w //workspace \
#   --entrypoint=cdk \
#   cdk-test:latest init sample-app --language typescript


FROM node:22-slim

# ワークディレクトリを設定
WORKDIR /app

# AWS CDKをグローバルにインストール
RUN npm install -g aws-cdk

# 必要な依存関係をインストール
# COPY package*.json ./
# RUN npm install

# アプリケーションコードをコピー
# COPY . .

# エントリーポイントを設定
ENTRYPOINT ["npx", "cdk"]

# docker build -t aws-cdk-ts-image .

# docker run -it --rm -v "$(pwd):/app" -w //app cdk-test:latest --help


# docker run -it --rm  -w //app -v "$(pwd):/app" cdk-test:latest init sample-app --language typescript