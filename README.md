# Lighthouse CLI

## Environment

- Shell: bash
- Node.js: 12.18.2
    - Yarn package manager: 1.22.4

***

## Architechure

![design.png](./img/design.png)

- DB:
    - UnQLite (ファイルベースのサーバレスNoSQLデータベース)
        - node-unqlite 利用
        - Express.js で IO API 提供
- Frontend:
    - Nuxt.js (Vue.js)
    - Tailwind.css
- Backend:
    - Node.js
        - lighthouse: Lighthouse計測CLI
        - node-cron: プログラム定期実行
