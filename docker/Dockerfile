FROM python:3.12-slim

RUN apt-get update && apt-get install -y less vim curl unzip sudo 

# https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-linux.html
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && sudo ./aws/install

# node.js公式リポジトリの追加
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
# インストール
RUN apt-get install -y nodejs
# aws cdkに必要なパッケージ
RUN npm install -g aws-cdk && npm install -g typescript ts-node


# 作業ディレクトリを設定
WORKDIR /aws

# エントリーポイントをbashに設定
ENTRYPOINT ["/aws"]