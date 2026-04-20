# 阪大感染管理マニュアル アプリ

大阪大学医学部附属病院 感染制御部が公開している「感染管理マニュアル 院外版」を、スマホで読みやすいテキストとして閲覧するためのシンプルなExpoアプリです。

## できること

- 章別の一覧表示
- Word原稿から変換したHTML本文表示
- Word内の画像・表の表示
- タイトル、更新日、本文を対象にしたキーワード検索
- `new` と更新日の表示
- 院内限定項目の明示
- 詳細画面から公式PDFを表示
- 公式ページを外部ブラウザで表示

## 起動方法

```bash
cd "/Users/kutsunasatoshi/Documents/New project/handai-infection-manual-app"
npm install
npm start
```

Expo GoでQRコードを読み取ると、iOS/Androidの実機で確認できます。

Expo Goで「Project is incompatible」と出ないよう、App Store / Google Play版のExpo Goに合わせてExpo SDK 54で構成しています。

ブラウザで確認する場合:

```bash
npm run web
```

8081番ポートの衝突を避けるため、起動ポートは8099にしています。

## PWAとして公開する

職員が各自のスマホ回線から利用する場合は、Expo GoではなくWeb/PWAとして公開するのがおすすめです。

```bash
npm run export:web
```

生成物は `dist-test/` に出力されます。Render、Vercel、Netlify、Cloudflare Pages、院内Webサーバーなどにこの内容を公開してください。

### Renderで公開する

Render Dashboardで `New` → `Static Site` を選び、このプロジェクトのGitHubリポジトリを接続します。

設定値:

```text
Root Directory: handai-infection-manual-app
Build Command: npm ci && npm run export:web
Publish Directory: dist-test
```

Blueprintで作成する場合は `render.yaml` を使えます。Render公式のStatic SiteはCDN配信、HTTPS、自動デプロイ、カスタムドメインに対応しています。

Render / Vercel / Netlify 用の設定は同梱済みです。

- `render.yaml`
- `vercel.json`
- `netlify.toml`

職員向け案内文は `docs/staff-pwa-install-guide.md` にあります。公開後は `https://公開URL/install.html` でもホーム画面への追加方法を確認できます。

## iOS/Androidビルド

App Store / Google Play 配布まで進める場合は、Expo Application Servicesを使います。

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

## Word本文データの更新

PDFリンク一覧と章構成は `src/data/manuals.js` にあります。検索用の軽量索引は `src/data/manualIndex.js`、Word由来のHTML本文と画像は `public/manuals/` に生成されます。

Wordファイルを更新した場合:

```bash
npm run convert:word
```

画像はHTML内に埋め込んでいるため、生成ファイルは大きくなります。図表の再現性を優先した構成です。

## PDF本文データの再生成

公式PDFから本文を再生成する場合:

```bash
python3 -m pip install --target tools/vendor pypdf
python3 tools/extract_manual_text.py
```

npm経由で実行する場合:

```bash
npm run extract:text
```

公式ページ:
https://www.hosp.med.osaka-u.ac.jp/home/hp-infect/contents/manual_top.html

## 注意

このアプリはWord原稿から変換したHTMLを表示します。Wordの完全なレイアウト再現ではありませんが、PDF抽出よりも改行、表、図を読みやすく扱える構成です。本文や判断に関わる内容は、必要に応じて公式PDFの最新版を確認してください。
