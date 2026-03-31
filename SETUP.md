# セットアップ手順

## 1. Google スプレッドシート作成

1. [Google スプレッドシート](https://sheets.google.com) で新規作成
2. シート名を `試飲会申込_回答` に変更
3. A1〜G1 にヘッダーを入力:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| タイムスタンプ | お名前 | フリガナ | メールアドレス | 参加人数 | ご参加経路 | 確認 |

## 2. Google Apps Script デプロイ

1. スプレッドシートのメニュー → **拡張機能** → **Apps Script**
2. エディタに `Code.gs` の内容を貼り付けて保存
3. **デプロイ** → **新しいデプロイ** をクリック
4. 設定:
   - 種類: **ウェブアプリ**
   - 実行ユーザー: **自分**
   - アクセスできるユーザー: **全員**
5. **デプロイ** → Google アカウント認証を許可
6. 表示された **URL をコピー**

## 3. HTMLフォームにURLを設定

`index.html` を開き、以下の行を編集:

```javascript
const GAS_URL = 'YOUR_GAS_WEB_APP_URL_HERE';
```

↓ コピーした URL に置き換え:

```javascript
const GAS_URL = 'https://script.google.com/macros/s/XXXXX.../exec';
```

## 4. フォームの公開

`index.html` を以下のいずれかの方法でホスティング:

- **GitHub Pages**（無料）
- **Firebase Hosting**
- **Vercel / Netlify**
- **Google Cloud Storage**

## 5. 動作確認

- [ ] フォームが正しく表示される
- [ ] テスト送信 → スプレッドシートに回答が記録される
- [ ] テスト送信 → 自動返信メールが届く
- [ ] 送信者名が「株式会社ヴァンパッシオン」になっている
- [ ] スマホ表示で崩れていないか確認

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| 送信しても何も起きない | ブラウザのコンソール（F12）でエラーを確認。GAS_URL が正しいか確認 |
| スプシに回答が入らない | GAS のデプロイ設定で「全員」にアクセスを許可しているか確認 |
| 自動メールが届かない | GAS エディタで「実行ログ」を確認。Gmail の送信上限に注意 |
| 送信元メールを変えたい | `GmailApp.sendEmail` の第4引数に `replyTo: "info@example.com"` を追加 |
| CORSエラーが出る | `mode: 'no-cors'` が設定されているか確認（index.html の fetch 部分） |
