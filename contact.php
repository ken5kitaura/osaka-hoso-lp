<?php
/* ============================================================
   osakahoso.com  問い合わせフォーム受信エンドポイント
   - 受信先 / 件名 / 送信元はこのファイル内に隠す（HTML には出さない）
   - JP / EN 判定で件名・本文を出し分け
   - 自動返信なし（運営宛通知のみ）
   - mb_send_mail で UTF-8 / 日本語ヘッダ対応
   ============================================================ */

declare(strict_types=1);

mb_language('uni');
mb_internal_encoding('UTF-8');
header('Cache-Control: no-store');

/* AJAX(fetch) か否か。AJAX 以外はリダイレクトで返し、JSON を画面に出さない */
$isAjax = (
    (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest') ||
    (stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false)
);
if ($isAjax) {
    header('Content-Type: application/json; charset=utf-8');
}

/* ---- 設定 ---- */
$TO         = 'kengo.kitaura@gmail.com';
$FROM       = 'no-reply@osakahoso.com';
$FROM_NAME  = '大阪放送株式会社 サイト問い合わせ';
$ALLOWED_ORIGINS = ['https://osakahoso.com', 'https://www.osakahoso.com'];

function reply(int $code, array $payload): void {
    global $isAjax;
    http_response_code($code);
    if ($isAjax) {
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }
    // 非 AJAX: 直前ページに戻して結果はクエリで伝える
    $back = $_SERVER['HTTP_REFERER'] ?? '/';
    $sep  = (strpos($back, '?') === false) ? '?' : '&';
    if (!empty($payload['ok'])) {
        $location = $back . $sep . 'sent=1#contact';
    } else {
        $err = preg_replace('/[^a-z0-9_]/i', '', (string)($payload['error'] ?? 'error'));
        $location = $back . $sep . 'sent=0&err=' . $err . '#contact';
    }
    header('Location: ' . $location, true, 303);
    exit;
}

function sanitize_header(string $s): string {
    // メールヘッダインジェクション対策: CR/LF/NULL を除去
    return trim(str_replace(["\r", "\n", "\0"], '', $s));
}

/* ---- メソッド / Origin チェック ---- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$originOk = false;
foreach ($ALLOWED_ORIGINS as $allow) {
    if ($origin === $allow) { $originOk = true; break; }
    if (strpos($referer, $allow . '/') === 0) { $originOk = true; break; }
}
if (!$originOk) {
    reply(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

/* ---- 入力 ---- */
$post = $_POST;

/* ハニーポット: bot が埋めたら静かに 200 で受理（実送信なし） */
if (!empty($post['website']) || !empty($post['url_field'])) {
    reply(200, ['ok' => true, 'spam' => true]);
}

$company = sanitize_header((string)($post['company'] ?? ''));
$name    = sanitize_header((string)($post['name']    ?? ''));
$email   = sanitize_header((string)($post['email']   ?? ''));
$tel     = sanitize_header((string)($post['tel']     ?? ''));
$message = trim((string)($post['message'] ?? ''));
$lang    = ($post['lang'] ?? '') === 'en' ? 'en' : 'ja';
$source  = sanitize_header((string)($post['source_page'] ?? ''));
$formId  = sanitize_header((string)($post['data_form']   ?? ''));

/* ---- バリデーション ---- */
if ($name === '' || $email === '' || $message === '') {
    reply(400, ['ok' => false, 'error' => 'required_missing']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(400, ['ok' => false, 'error' => 'invalid_email']);
}
if (mb_strlen($name) > 200 || mb_strlen($company) > 200 || mb_strlen($tel) > 60) {
    reply(400, ['ok' => false, 'error' => 'too_long']);
}
if (mb_strlen($message) > 8000) {
    reply(400, ['ok' => false, 'error' => 'message_too_long']);
}

/* ---- 件名・本文 ---- */
if ($lang === 'en') {
    $subject = '[osakahoso.com / EN] New inquiry from ' . ($company !== '' ? $company . ' / ' : '') . $name;
    $body  = "A new inquiry has arrived from the website (EN).\n";
    $body .= "----------------------------------------\n";
    $body .= "Company : {$company}\n";
    $body .= "Name    : {$name}\n";
    $body .= "Email   : {$email}\n";
    $body .= "Phone   : {$tel}\n";
    $body .= "Source  : {$source}\n";
    $body .= "Form    : {$formId}\n";
    $body .= "----------------------------------------\n";
    $body .= "Message:\n{$message}\n";
    $body .= "----------------------------------------\n";
    $body .= 'Received: ' . date('Y-m-d H:i:s') . " (JST)\n";
    $body .= 'IP      : ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";
} else {
    $subject = '【osakahoso.com】新規お問い合わせ：' . ($company !== '' ? $company . ' / ' : '') . $name . ' 様';
    $body  = "サイトから新しいお問い合わせが届きました。\n";
    $body .= "----------------------------------------\n";
    $body .= "会社名 : {$company}\n";
    $body .= "お名前 : {$name}\n";
    $body .= "メール : {$email}\n";
    $body .= "電話   : {$tel}\n";
    $body .= "送信元 : {$source}\n";
    $body .= "Form ID: {$formId}\n";
    $body .= "----------------------------------------\n";
    $body .= "【ご相談内容】\n{$message}\n";
    $body .= "----------------------------------------\n";
    $body .= '受信日時: ' . date('Y-m-d H:i:s') . " (JST)\n";
    $body .= 'IP      : ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";
}

/* ---- ヘッダ ---- */
$fromHeader = mb_encode_mimeheader($FROM_NAME, 'UTF-8') . ' <' . $FROM . '>';
$headers  = "From: {$fromHeader}\r\n";
$headers .= "Reply-To: {$email}\r\n";  // 受信者がそのまま返信できる
$headers .= "X-Mailer: osakahoso-contact/1.0\r\n";
$headers .= "MIME-Version: 1.0\r\n";

date_default_timezone_set('Asia/Tokyo');

$ok = @mb_send_mail($TO, $subject, $body, $headers);

if (!$ok) {
    reply(500, ['ok' => false, 'error' => 'mail_failed']);
}

reply(200, ['ok' => true]);
