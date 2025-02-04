# infra-playground
インフラ周辺をガチャガチャ検証する場所



## メモ
### dockerイメージを利用してコマンド実行(linux)

参考
https://hub.docker.com/r/amazon/aws-cli
https://hub.docker.com/r/hashicorp/terraform

aws cli
``` 
docker run --rm -it -v $HOME/.aws:/root/.aws amazon/aws-cli
```

terraform
```
docker run -it --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:latest
```

エイリアスの指定
```
vi ~/.bashrc
```

.bashrc
```
alias aws='docker run --rm -it -v $HOME/.aws:/root/.aws amazon/aws-cli'
alias terraform='docker run -it --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:latest'
```

設定の反映
```
source ~/.bashrc
```
