/**
 * サロンドヴァンパッシオン試飲会 — Google Apps Script
 *
 * 【設置手順】
 * 1. Google スプレッドシートを新規作成
 * 2. シート名を「試飲会申込_回答」に変更
 * 3. A1:G1 にヘッダーを入力
 * 4. メニュー「拡張機能」→「Apps Script」
 * 5. このコードを貼り付けて保存
 * 6. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *    - 実行ユーザー: 自分
 *    - アクセス: 全員
 * 7. デプロイ → 表示されたURLを index.html の GAS_URL に貼り付け
 */

// ── GET/POST 両対応 ──
function doGet(e) {
  if (e.parameter && e.parameter.name) {
    return handleSubmission(JSON.stringify(e.parameter));
  }
  return ContentService
    .createTextOutput('Tasting form API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var body = e.postData ? e.postData.contents : null;
  if (body) {
    return handleSubmission(body);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'error', message: 'No data' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleSubmission(raw) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = JSON.parse(raw);

    // スプレッドシートに記録
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('試飲会申込_回答') || ss.getSheets()[0];

    var jst = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

    sheet.appendRow([
      jst,
      data.name,
      data.furigana,
      data.email,
      data.guests,
      data.source,
      '了承済み'
    ]);

    // 自動返信メール送信
    sendConfirmationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ── 自動返信メール ──
function sendConfirmationEmail(data) {
  var subject = '【サロンドヴァンパッシオン】サロンドヴァンパッシオン試飲会 お申し込み受付のご確認';

  var summary =
    '　お名前　　　：' + data.name + '　様（' + data.furigana + '）\n' +
    '　参加人数　　：' + data.guests + '\n' +
    '　ご参加経路　：' + (data.source || '未回答') + '\n';

  var body =
    data.name + ' 様\n\n' +
    'この度はサロンドヴァンパッシオン試飲会にお申し込みいただき、\n' +
    '誠にありがとうございます。\n\n' +
    '以下の内容でお申し込みを承りました。\n\n' +
    '──────────────────────────────\n' +
    '【お申し込み内容】\n' +
    summary +
    '──────────────────────────────\n\n' +
    'ご不明な点がございましたら、お気軽に公式LINEまでお問い合わせください。\n\n' +
    '2〜3日以内に担当者より、LINEにて決済リンクをお送りいたします。\n' +
    '決済完了をもってご予約確定となります。\n\n' +
    'なお、申込人数が定員に達した場合は、ご予約をお受けできない場合が\n' +
    'ございますことを、あらかじめご了承いただけますと幸いです。\n\n' +
    '引き続きどうぞよろしくお願いいたします。\n\n' +
    '──────────────────────────────\n' +
    '　青山ブルゴーニュ.shop\n' +
    '──────────────────────────────\n';

  GmailApp.sendEmail(data.email, subject, body, {
    name: 'サロンドヴァンパッシオン',
    from: 'salondevp@vp2004.net'
  });
}
