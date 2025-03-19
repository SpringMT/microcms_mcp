# microCMS MCP Server

Model Context Protocol (MCP) 対応の microCMS 検索サーバーです。LLM から microCMS のコンテンツを検索・取得するために使用できます。

## 機能

- microCMS APIを使用したコンテンツの検索
- 特定のコンテンツの取得
- MCP (Model Context Protocol) 準拠のインターフェース


## 必要な環境変数の説明

- `MICROCMS_API_KEY`: microCMSのAPIキー（必須）
- `MICROCMS_SERVICE_DOMAIN`: microCMSのサービスドメイン（必須）
- `MICROCMS_ENDPOINT`: 利用するエンドポイント

## ビルド

```bash
npm run build
```

## 使い方

### MCPクライアントからの使用

このサーバーはMCPプロトコルに準拠しているため、MCP対応のLLMクライアントから呼び出すことができます。

```
{
    "mcpServers": {
        "microcms": {
            "command": "node",
            "args": [
                "/ABSOLUTE/PATH/TO/PARENT/FOLDER/build/index.js"
            ],
            "env": {
                "MICROCMS_API_KEY": "",
                "MICROCMS_SERVICE_DOMAIN": "",
                "MICROCMS_ENDPOINT": ""
            }
        }
    }
}
```



## 関連リンク

- [microCMS](https://microcms.io/)
- [Model Context Protocol](https://modelcontextprotocol.ai/)
- [microcms-js-sdk](https://github.com/microcmsio/microcms-js-sdk) 