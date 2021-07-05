+++
title = "AppSyncでGraphQLのsubscriptionのAPIを作る"
date = "2021-04-13"
tags = ["AppSync", "Dynamo DB"]
+++

Dynamo DBをデータソースにしてGraphQLでaddやdeleteのmutationを用意し、それのトリガーとしてsubscriptionのAPIを作ってみた。

[Githubのリポジトリ](https://github.com/suzukiken/cdkappsync-subscription)

AWSコンソールのAppSyncのクエリのページで試す分には問題なく動いているんだけど、AmplifyのAPIで呼び出すとsubscriptionのメッセージは通知されるんだけど、内容がnullなんですよねえ。どうすればいいんだろうなあ、というところで止まっています。

上のリポジトリはそのAmplifyのフロントエンドではなくバックエンドの仕組みのところだけです。