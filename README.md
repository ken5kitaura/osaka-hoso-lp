# osakahoso.com — 運用ノート

大阪放送株式会社の静的サイト (lolipop + Vercel ミラー)。

---

## ホスティング
- **本番**: lolipop / `osakahoso.com` (FTP: `ftp.lolipop.jp` / アカウント: `main.jp-6465c30359813ab6`)
- **ミラー**: Vercel / `osaka-hoso-lp.vercel.app` (GitHub `ken5kitaura/osaka-hoso-lp` の auto-deploy)
- **HTTPS**: Let's Encrypt (lolipop / Vercel とも自動)
- **canonical**: 全ページ `https://osakahoso.com/` (Vercel ミラーは canonical=lolipop)

---

## デプロイ運用

1. ローカル編集 → `git add` → `git commit` → `git push origin main` (GitHub バックアップ / Vercel auto-deploy)
2. lolipop には `curl -T ... ftp://...` で個別アップロード
3. CSS/JS を編集したら全 HTML の `?v=YYYYMMDD~` を bump (キャッシュバスト)
4. アップロード後は curl で実機検証 (HTTP ステータス / hreflang / JSON-LD 等)

---

## SEO / AIO

### sitemap.xml & GSC
- `/sitemap.xml` に全 URL (現在 20件)
- GSC 提出済み (`https://osakahoso.com/sitemap.xml`)

### Bing Webmaster Tools — **IndexNow を使う**
Bing は sitemap が timed out で通らないため、**IndexNow 直接通知** に切り替え:

- **API キーファイル**: `https://osakahoso.com/{KEY}.txt` (Phase 1 で配置済み)
- **キー本体**: `~/painkiller/osakahoso/secrets/indexnow-key.txt` (ローカル保管)
- **運用スクリプト**:
  - 単発 / 任意URL: `~/painkiller/osakahoso/tools/indexnow_ping.sh URL [URL...]`
  - sitemap一括: `~/painkiller/osakahoso/tools/indexnow_ping_all.sh`

### IndexNow 運用ルール
| タイミング | やる事 |
|---|---|
| 新記事公開時 | `indexnow_ping.sh https://osakahoso.com/column/{slug}` |
| サイト構造変更時 (URL 増減) | 影響URL を `indexnow_ping.sh` で個別ping |
| 月次 (毎月1日 / 推奨) | `indexnow_ping_all.sh` で sitemap全URL を一括同期 |
| 大型キャンペーン後 | 同じく `indexnow_ping_all.sh` |

期待レスポンス: `HTTP 202 Accepted` (受理) / `200 OK` (即時インデックス)

### Google: IndexNow 非対応
- Google は IndexNow を受信しない → 引き続き **GSC + sitemap.xml** で運用
- 新規 URL の早期インデックス促進したい場合は GSC > URL 検査 > インデックス登録をリクエスト

---

## 主要技術
- 静的 HTML/CSS/JS (ビルドなし)
- WebP 自動配信 (`.htaccess` の Accept ネゴ)
- `<picture>` は不使用 (互換性問題回避、`.htaccess` の WebP rewrite で代替)
- Person/Organization/BlogPosting/BreadcrumbList/FAQPage の JSON-LD 完備
- `llms.txt` / `llms-full.txt` で AI 検索エンジン向けの構造化テキスト提供

---

## 関連リポジトリ
- このサイト: `https://github.com/ken5kitaura/osaka-hoso-lp` (public)
- 北浦個人ハブ: `https://github.com/ken5kitaura/kengokitaura-com` (private)
