# CDK コマンド実行用コンテナ

### 使用方法

- イメージのビルド

- エイリアスの指定
vi ~/.bashrc
```
alias aws='docker container run -it --rm -v $HOME/.aws:/root/.aws -w /workspace -v "$(pwd):/workspace" my-aws-cdk-cli:latest'
```

- 設定の反映
```
source ~/.bashrc
```