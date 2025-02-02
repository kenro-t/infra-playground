# infra-playground
インフラ周辺をガチャガチャ検証する場所



## メモ
### git bashでdockerイメージを利用してaws cliを実行する

git bashの場合（パスの指定方法が変わる）
``` 
docker run --rm -it -v /$(pwd -W)/.aws:/root/.aws amazon/aws-cli
```

linuxの場合
```
docker run --rm -ti -v ~/.aws:/root/.aws amazon/aws-cli
```