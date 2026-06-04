# 大阪放送LP 英訳用ソース（JP本文 → EN）

このディレクトリは、osakahoso.com の英語化作業のために**日本語ページの本文だけを抽出した md** を集めた場所です。HTML / CSS のノイズを除外し、翻訳者（人間 or AI）が文章だけに集中できるようにしてあります。

## ファイル構成

```
en-source/
├── README.md                  ← このファイル（運用説明）
├── GLOSSARY.md                ← 絶対ルール（OBC関係 / 固有名詞 / トーン）★最優先
├── index.md                   ← / トップページ
├── ai-bpo.md                  ← /ai-bpo 事業ハブページ
├── story.md                   ← /story 創業物語
├── ai-bpo/
│   ├── system.md              ← /ai-bpo/system AI経理システム導入
│   ├── training.md            ← /ai-bpo/training AI活用研修
│   └── bpo.md                 ← /ai-bpo/bpo 月額BPO運用
└── translated/                ← 翻訳が完成したら ここに同名で配置（人 or AI が記入）
    ├── index.md
    ├── ai-bpo.md
    └── ...
```

## 翻訳AIへの依頼テンプレ

```
このリポジトリ ( https://github.com/ken5kitaura/osaka-hoso-lp ) の
en-source/ 以下を読んでください。

最優先で en-source/GLOSSARY.md を読み、絶対ルール（特にOBCの呼び方）を
順守してください。

en-source/index.md（または対象ページ）の日本語本文を、
en-source/translated/index.md として英訳してください。

要件:
- セクション構造は維持
- 見出しレベル(#/##/###)は同じ
- ボイスは confident + bold（GLOSSARY のトーン方針）
- 数字・固有名詞は GLOSSARY のとおり
- 過剰な敬語は不要（英語版は世界の読者に直接話しかける）
```

## 完成後のフロー

1. AI が `en-source/translated/*.md` を返す（または直接コミット）
2. CC (私) が JP HTML を複製→本文だけEN差し替え→ `/en/` 配下へHTML配置
3. シミュレーター UI ラベルや JSON-LD などは CC が個別対応（計算式は同じ）
4. 言語スイッチ・hreflang・canonical を整備して GitHub push
5. Vercel auto-deploy → 確認

## 注意

- **HTML/CSS は変更しない**。翻訳は本文テキストだけ
- 数字は誇張しない（補助金率・金額は JP と同じ値）
- 写真の alt 属性も別途英訳（このmd末尾「画像alt」セクション参照）
- シミュレーターA/B の計算ロジック・補助率は変更不可
