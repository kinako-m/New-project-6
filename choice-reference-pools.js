// Reference-only catalog for writing and reviewing per-question distractors.
// The app never selects choices directly from these pools.
globalThis.CHOICE_REFERENCE_POOLS = {
  networkProtocols: [
    "DNS: ドメイン名とIPアドレスを対応付ける",
    "DHCP: 端末へネットワーク設定を自動配布する",
    "ARP: IPアドレスからMACアドレスを求める",
    "ICMP: IP通信のエラー通知や到達確認に使う",
    "SNMP: ネットワーク機器の監視や管理に使う",
    "TLS: 通信相手の認証と通信内容の暗号化を行う"
  ],
  mailProtocols: [
    "SMTP: 電子メールを送信・中継する",
    "POP3: 電子メールを端末へ取得する",
    "IMAP: 電子メールをサーバ上で管理しながら閲覧する",
    "S/MIME: 電子メールへ署名や暗号化を適用する"
  ],
  databaseConstraints: [
    "PRIMARY KEY: 行を一意に識別する",
    "FOREIGN KEY: 表同士の参照整合性を保つ",
    "UNIQUE: 指定列の値の重複を防ぐ",
    "NOT NULL: NULLの入力を禁止する",
    "CHECK: 入力値が条件を満たすか検証する"
  ],
  securityControls: [
    "IDS: 不正侵入の兆候を検知して通知する",
    "IPS: 不正な通信を検知して遮断する",
    "WAF: Webアプリケーションへの攻撃を検知・防御する",
    "ファイアウォール: 通信ルールに基づいて許可・拒否する",
    "多要素認証: 異なる認証要素を組み合わせる"
  ],
  algorithmComplexity: [
    "O(1): 入力件数に処理量が左右されない",
    "O(log n): 探索範囲を段階的に狭める",
    "O(n): 全要素を一度ずつ確認する",
    "O(n log n): 分割と全体処理を組み合わせる",
    "O(n²): 全要素を調べる処理を二重に行う"
  ],
  normalization: [
    "第1正規形: 繰返し項目をなくして各項目を単一値にする",
    "第2正規形: 部分関数従属を除く",
    "第3正規形: 推移的関数従属を除く",
    "BCNF: 全ての決定項を候補キーにする"
  ]
};

if (typeof module !== "undefined") module.exports = globalThis.CHOICE_REFERENCE_POOLS;
