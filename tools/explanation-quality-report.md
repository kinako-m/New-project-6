# Explanation Quality Report

Generated: 2026-06-21T10:23:55.925Z
Questions: 822
Findings: 301
High: 0
Medium: 165
Low: 136

## Top Finding Types

- possible-acronym-duplication: 98
- weak-correct-reason: 70
- short-definition-explanation: 60
- weak-distractor-explanation: 38
- generic-explanation: 19
- short-subject-b-explanation: 16

## Findings By Stage

- database: 102
- management: 88
- technology: 66
- strategy: 33
- algorithm: 12

## LOW possible-acronym-duplication

- ID: technology-005
- Stage: テクノロジ系
- Tag: データ表現
- Question: 文字コード UTF-8 の特徴として適切なものはどれか。
- Correct: Unicodeを1〜4バイトの可変長で表現できる
- Explanation: UTF-8はUnicodeの文字を1〜4バイトの可変長で表現します。ASCIIと同じ文字は1バイトになるため、既存のASCIIデータとも互換性があります。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-007
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: HTTPステータスコード 404 が表す状態はどれか。
- Correct: 要求した資源が見つからない
- Explanation: 404 Not Found は、指定されたURLの資源が見つからないことを示します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-050
- Stage: テクノロジ系
- Tag: 頻出計算
- Question: 平均故障間隔を表す指標はどれか。
- Correct: MTBF
- Explanation: MTBFはMean Time Between Failuresです。 信頼性・可用性の問題では、故障しにくさ、修理の早さ、稼働している割合を分けます。直列構成は全て動く必要があり、並列構成は全て故障した場合に停止する点が計算の軸です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-051
- Stage: テクノロジ系
- Tag: 頻出計算
- Question: 平均修復時間を表す指標はどれか。
- Correct: MTTR
- Explanation: MTTRはMean Time To Repairです。 信頼性・可用性の問題では、故障しにくさ、修理の早さ、稼働している割合を分けます。直列構成は全て動く必要があり、並列構成は全て故障した場合に停止する点が計算の軸です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-055
- Stage: テクノロジ系
- Tag: 頻出計算
- Question: HTTPSで一般に使われるTCPポート番号はどれか。
- Correct: 443
- Explanation: HTTPSは通常TCP 443番を使います。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-056
- Stage: テクノロジ系
- Tag: 頻出計算
- Question: HTTPで一般に使われるTCPポート番号はどれか。
- Correct: 80
- Explanation: HTTPは通常TCP 80番を使います。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-057
- Stage: テクノロジ系
- Tag: 頻出計算
- Question: DNSで一般に使われるポート番号はどれか。
- Correct: 53
- Explanation: DNSは主に53番ポートを使います。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-058
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: SMTPについて正しい説明はどれか。
- Correct: 電子メールを送信・中継するためのプロトコル
- Explanation: SMTPは電子メールの送信やメールサーバ間の中継に使います。サーバ上でメールを管理しながら読むのはIMAP、端末へ取得するのはPOP3、電子署名や暗号化を適用する規格はS/MIMEです。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-059
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: POP3について正しい説明はどれか。
- Correct: メールを端末へ取り込むためのプロトコル
- Explanation: POP3はメールを端末へ取り込むためのプロトコルです。関連キーワード: 110。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-060
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: IMAPについて正しい説明はどれか。
- Correct: メールをサーバ上で管理しながら複数端末から閲覧するプロトコル
- Explanation: IMAPはメールをサーバ上で管理したまま閲覧するため、複数端末で状態を共有しやすいプロトコルです。送信・中継はSMTP、端末への取得はPOP3、署名・暗号化の規格はS/MIMEです。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-063
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: SNMPについて正しい説明はどれか。
- Correct: ネットワーク機器の状態監視や設定管理に使うプロトコル
- Explanation: SNMPはルータやスイッチなどの状態監視・管理に使うプロトコルです。暗号化通信はTLS、IPアドレスからMACアドレスを求めるのはARP、ネットワーク設定を自動配布するのはDHCPです。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-064
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: NTPについて正しい説明はどれか。
- Correct: ネットワーク経由で時刻を同期するプロトコル
- Explanation: NTPはネットワーク経由で時刻を同期するプロトコルです。関連キーワード: 123。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-065
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: ICMPについて正しい説明はどれか。
- Correct: IP通信のエラー通知や到達確認に使うプロトコル
- Explanation: ICMPはIP通信のエラー通知や到達確認に使われ、pingも利用します。暗号化通信はTLS、IPアドレスからMACアドレスを求めるのはARP、ネットワーク設定を自動配布するのはDHCPです。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-066
- Stage: テクノロジ系
- Tag: 頻出用語
- Question: MACアドレスについて正しい説明はどれか。
- Correct: LAN上の機器を識別するための物理アドレス
- Explanation: MACアドレスはLAN上の機器を識別するための物理アドレスです。関連キーワード: 48ビット。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-073
- Stage: テクノロジ系
- Tag: 実戦問題
- Question: HTTPS通信でサーバ証明書を確認する主な目的はどれか。
- Correct: 接続先のサーバが正当であることを確認する
- Explanation: 証明書により接続先の正当性を確認し、なりすましを防ぎます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-080
- Stage: テクノロジ系
- Tag: ハードウェア
- Question: 「算術演算や論理演算を行うCPU内の装置」に該当する用語はどれか。
- Correct: ALU
- Explanation: ALUは、算術演算や論理演算を行うCPU内の装置です。 制御装置とは役割が異なります。 ハードウェア問題では、処理装置、主記憶、補助記憶、入出力装置のどこで働く仕組みかを分けて考えます。速度差を埋めるのか、容量を確保するのか、耐障害性を高めるのかが判断点です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-081
- Stage: テクノロジ系
- Tag: ハードウェア
- Question: ALUの説明として適切なものはどれか。
- Correct: 加算や論理演算などを実行する演算回路
- Explanation: ALUは、算術演算や論理演算を行うCPU内の装置です。 制御装置とは役割が異なります。 ハードウェア問題では、処理装置、主記憶、補助記憶、入出力装置のどこで働く仕組みかを分けて考えます。速度差を埋めるのか、容量を確保するのか、耐障害性を高めるのかが判断点です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-082
- Stage: テクノロジ系
- Tag: ハードウェア
- Question: ALUを見分ける特徴として最も適切なものはどれか。
- Correct: 算術演算と論理演算を行う
- Explanation: ALUでは「加算やAND演算を行う」が重要です。制御装置とは役割が異なります。 ハードウェア問題では、処理装置、主記憶、補助記憶、入出力装置のどこで働く仕組みかを分けて考えます。速度差を埋めるのか、容量を確保するのか、耐障害性を高めるのかが判断点です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-116
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「ドメイン名とIPアドレスを対応付ける仕組み」に該当する用語はどれか。
- Correct: DNS
- Explanation: DNSは、ドメイン名とIPアドレスを対応付ける仕組みです。 Webアクセス時にも利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-117
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: DNSの説明として適切なものはどれか。
- Correct: ドメイン名とIPアドレスを対応付ける仕組み
- Explanation: DNSは、ドメイン名とIPアドレスを対応付ける仕組みです。 Webアクセス時にも利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-118
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: DNSを見分ける特徴として最も適切なものはどれか。
- Correct: ドメイン名からIPアドレスを解決する
- Explanation: DNSでは「名前解決を行う」が重要です。Webアクセス時にも利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-119
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「端末へIPアドレスなどを自動配布する仕組み」に該当する用語はどれか。
- Correct: DHCP
- Explanation: DHCPは、端末へIPアドレスなどを自動配布する仕組みです。 管理者の設定負荷を減らします。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-120
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: DHCPの説明として適切なものはどれか。
- Correct: 端末へIPアドレスなどを自動配布する仕組み
- Explanation: DHCPは、端末へIPアドレスなどを自動配布する仕組みです。 管理者の設定負荷を減らします。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-121
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: DHCPを見分ける特徴として最も適切なものはどれか。
- Correct: 端末へIP設定を自動配布する
- Explanation: DHCPでは「IP設定を自動配布する」が重要です。管理者の設定負荷を減らします。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-122
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「IPアドレスからMACアドレスを求めるプロトコル」に該当する用語はどれか。
- Correct: ARP
- Explanation: ARPは、IPアドレスからMACアドレスを求めるプロトコルです。 IP通信の前段で利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-123
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: ARPの説明として適切なものはどれか。
- Correct: IPアドレスからMACアドレスを求めるプロトコル
- Explanation: ARPは、IPアドレスからMACアドレスを求めるプロトコルです。 IP通信の前段で利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-124
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: ARPを見分ける特徴として最も適切なものはどれか。
- Correct: IPアドレスからMACアドレスを求める
- Explanation: ARPでは「同一LAN内でMACアドレスを求める」が重要です。IP通信の前段で利用されます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-127
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: NATを見分ける特徴として最も適切なものはどれか。
- Correct: プライベートIPとグローバルIPを変換する
- Explanation: NATでは「アドレス変換を行う」が重要です。社内端末のインターネット接続などで使います。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-128
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「公衆網上に仮想的な専用通信路を作る技術」に該当する用語はどれか。
- Correct: VPN
- Explanation: VPNは、公衆網上に仮想的な専用通信路を作る技術です。 社外から社内へ接続する場面で使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-129
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: VPNの説明として適切なものはどれか。
- Correct: 公衆網上に仮想的な専用通信路を作る技術
- Explanation: VPNは、公衆網上に仮想的な専用通信路を作る技術です。 社外から社内へ接続する場面で使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-130
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: VPNを見分ける特徴として最も適切なものはどれか。
- Correct: 公衆網上に安全な仮想通信路を作る
- Explanation: VPNでは「安全な仮想通信路を作る」が重要です。社外から社内へ接続する場面で使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-131
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「信頼性のあるコネクション型通信を行うプロトコル」に該当する用語はどれか。
- Correct: TCP
- Explanation: TCPは、信頼性のあるコネクション型通信を行うプロトコルです。 UDPとの違いが頻出です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-132
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: TCPの説明として適切なものはどれか。
- Correct: 再送や順序制御を行う信頼性のある通信プロトコル
- Explanation: TCPは、信頼性のあるコネクション型通信を行うプロトコルです。 UDPとの違いが頻出です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-133
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: TCPを見分ける特徴として最も適切なものはどれか。
- Correct: 再送や順序制御で信頼性を高める
- Explanation: TCPでは「再送や順序制御を行う」が重要です。UDPとの違いが頻出です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-134
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「軽量なコネクションレス通信を行うプロトコル」に該当する用語はどれか。
- Correct: UDP
- Explanation: UDPは、軽量なコネクションレス通信を行うプロトコルです。 動画配信や音声などで使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-135
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: UDPの説明として適切なものはどれか。
- Correct: 再送制御を省いて低遅延を重視する通信プロトコル
- Explanation: UDPは、軽量なコネクションレス通信を行うプロトコルです。 動画配信や音声などで使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-136
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: UDPを見分ける特徴として最も適切なものはどれか。
- Correct: 再送制御を省いて低遅延を重視する
- Explanation: UDPでは「低遅延を重視する」が重要です。動画配信や音声などで使われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-137
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: 「通信相手の認証と暗号化通信を提供するプロトコル」に該当する用語はどれか。
- Correct: TLS
- Explanation: TLSは、通信相手の認証と暗号化通信を提供するプロトコルです。 サーバ証明書と合わせて問われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-138
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: TLSの説明として適切なものはどれか。
- Correct: 通信相手の認証と暗号化通信を提供するプロトコル
- Explanation: TLSは、通信相手の認証と暗号化通信を提供するプロトコルです。 サーバ証明書と合わせて問われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-139
- Stage: テクノロジ系
- Tag: ネットワーク
- Question: TLSを見分ける特徴として最も適切なものはどれか。
- Correct: HTTPSの安全性を支える
- Explanation: TLSでは「HTTPSの安全性を支える」が重要です。サーバ証明書と合わせて問われます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-147
- Stage: テクノロジ系
- Tag: 科目Bセキュリティ
- Question: 退職者のアカウントで深夜にログイン成功が記録された。最初に行う対応として適切なものはどれか。
- Correct: 該当アカウントを無効化し、操作履歴と影響範囲を保全する
- Explanation: 不正利用の拡大を止めるため該当アカウントを無効化し、調査に必要なログと操作履歴を保全します。確認待ちで利用可能なままにしたり、証拠を削除したりしてはいけません。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-149
- Stage: テクノロジ系
- Tag: インシデント対応
- Question: Webサーバのログに同一IPから短時間で大量のログイン失敗がある。適切な対策はどれか。
- Correct: 試行回数制限と多要素認証を導入する
- Explanation: ブルートフォース攻撃には試行制限、ロック、MFAなどが有効です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-156
- Stage: テクノロジ系
- Tag: Webセキュリティ
- Question: ログイン済み利用者の意図しない送金要求を防ぐ対策として適切なものはどれか。
- Correct: 推測困難なCSRFトークンをサーバ側で検証する
- Explanation: ログイン済み利用者へ意図しない要求を送らせる攻撃には、要求元を確認できるCSRFトークンの検証が有効です。XSS対策やSQLインジェクション対策とは目的が異なります。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-158
- Stage: テクノロジ系
- Tag: ネットワーク防御
- Question: 社外から社内システムへ安全に接続させたい。適切な構成はどれか。
- Correct: VPNと多要素認証を利用する
- Explanation: 暗号化されたVPNとMFAを組み合わせることで安全性を高めます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-159
- Stage: テクノロジ系
- Tag: ネットワーク防御
- Question: 公開Webサーバが侵害されても社内LANへ直接到達しにくくする構成はどれか。
- Correct: WebサーバをDMZへ配置する
- Explanation: DMZで公開サーバと内部ネットワークを分離します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-176
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 通販サイトで、同一IPアドレスから多数の利用者IDに対するログイン失敗が短時間に発生した。正しいパスワードで成功した記録も一部ある。被害拡大を抑えつつ調査を進める最初の対応として最も適切なものはどれか。
- Correct: 試行回数制限や追加認証を適用し、関連ログを保全して影響範囲を確認する
- Explanation: パスワードスプレーなどの可能性があります。認証試行を制限して被害拡大を抑え、ログを保全した上で成功したアカウントや操作内容を調査します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢（全利用者へ同じ新しいパスワードを設定する）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-176
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 通販サイトで、同一IPアドレスから多数の利用者IDに対するログイン失敗が短時間に発生した。正しいパスワードで成功した記録も一部ある。被害拡大を抑えつつ調査を進める最初の対応として最も適切なものはどれか。
- Correct: 試行回数制限や追加認証を適用し、関連ログを保全して影響範囲を確認する
- Explanation: パスワードスプレーなどの可能性があります。認証試行を制限して被害拡大を抑え、ログを保全した上で成功したアカウントや操作内容を調査します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢（全利用者へ同じ新しいパスワードを設定する）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-177
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 営業部門が顧客一覧を外部の印刷会社へ渡す。印刷に必要なのは氏名と送付先だけだが、元データには生年月日、購入履歴、社内メモも含まれる。最も適切な対応はどれか。
- Correct: 必要な氏名と送付先だけを抽出し、暗号化・アクセス制御・作業後削除を契約で定める
- Explanation: データ最小化により提供範囲を必要項目だけに絞り、転送・保管時の保護と削除条件を明確にします。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-179
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 従業員PCでランサムウェア感染が疑われ、共有フォルダ内のファイル名が次々に変化している。最初に行う対応として最も適切なものはどれか。
- Correct: 感染が疑われるPCをネットワークから隔離し、証拠と影響範囲を確認する
- Explanation: 暗号化の拡大を止めるため、まず感染端末をネットワークから隔離します。その後、証拠を保全して影響範囲を確認し、安全を確認したバックアップから復旧します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-179
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 従業員PCでランサムウェア感染が疑われ、共有フォルダ内のファイル名が次々に変化している。最初に行う対応として最も適切なものはどれか。
- Correct: 感染が疑われるPCをネットワークから隔離し、証拠と影響範囲を確認する
- Explanation: 暗号化の拡大を止めるため、まず感染端末をネットワークから隔離します。その後、証拠を保全して影響範囲を確認し、安全を確認したバックアップから復旧します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-187
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 社内無線LANで、退職者が以前共有されていた共通パスワードを使って接続できた。改善策として最も適切なものはどれか。
- Correct: 利用者・端末ごとの認証を導入し、退職時に個別資格情報を失効させる
- Explanation: 共通パスワードでは退職者だけを個別に失効できません。利用者・端末ごとの認証を導入し、退職時に該当する資格情報を無効化できる運用が適切です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-187
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 社内無線LANで、退職者が以前共有されていた共通パスワードを使って接続できた。改善策として最も適切なものはどれか。
- Correct: 利用者・端末ごとの認証を導入し、退職時に個別資格情報を失効させる
- Explanation: 共通パスワードでは退職者だけを個別に失効できません。利用者・端末ごとの認証を導入し、退職時に該当する資格情報を無効化できる運用が適切です。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-188
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 公開Webサーバに重大な脆弱性が見つかったが、修正版の適用には数日かかる。暫定対応として最も適切なものはどれか。
- Correct: 不要な機能を停止し、WAFやアクセス制限で攻撃経路を絞り、監視を強化する
- Explanation: 修正版を適用できるまで、不要機能の停止、アクセス制限、WAF、監視強化などの補完的対策で露出と影響を抑えます。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-189
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 複数サーバのログ時刻が数分ずつずれており、不正アクセス時の操作順序を追跡できない。改善策として最も適切なものはどれか。
- Correct: 信頼できる時刻源と同期し、ログの時刻形式とタイムゾーンを統一する
- Explanation: 複数機器のログを正しく突合するには、信頼できる時刻源との同期と、時刻形式・タイムゾーンの統一が必要です。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢（調査時に担当者がログ時刻を目視で補正する）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-195
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 社内システムの管理画面がインターネットから直接アクセス可能で、ログイン試行制限もない。優先して行う改善はどれか。
- Correct: 接続元を管理用ネットワークなどへ制限し、多要素認証と試行制限を導入する
- Explanation: 管理画面の露出を減らし、認証強化と試行制限によって不正ログインのリスクを下げます。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢（管理画面のURLを短くする、全社員へ管理者権限を付与する、ログイン失敗を記録しないようにする）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-197
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: オンライン会議の録画に顧客情報が含まれている。参加者以外へ不用意に公開されることを防ぐ運用はどれか。
- Correct: 閲覧者を必要な人に限定し、保存期間と削除手順を定める
- Explanation: 顧客情報を含む録画は、必要最小限の閲覧権限、保存期間、削除手順を定めて管理します。URLだけに依存した公開や個人領域への複製は避けます。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-198
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: システムへログイン後、長時間操作しなくてもセッションが無期限に有効なままである。改善策として最も適切なものはどれか。
- Correct: 一定時間の無操作でセッションを失効させ、重要操作では再認証を求める
- Explanation: 無操作タイムアウトと重要操作時の再認証により、離席や端末紛失時の不正利用を抑えます。セッションIDの長さだけでは無期限利用のリスクを解消できません。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-199
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: DNSの設定変更後、利用者が偽のWebサイトへ誘導された。管理者アカウントの不正利用が疑われる。最初の対応として最も適切なものはどれか。
- Correct: 不正な設定を安全な値へ戻し、管理者資格情報を失効して変更履歴を調査する
- Explanation: 誘導を止めて正しい設定へ復旧し、侵害された可能性のある資格情報を失効して原因と影響を調査します。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。 他の選択肢（偽サイトへの誘導を放置する、DNSの変更履歴を削除する、管理者アカウントを全社員で共有する）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-200
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: システム開発で利用する外部ライブラリに、既知の重大な脆弱性が含まれていることが判明した。適切な対応はどれか。
- Correct: 利用箇所と影響を確認し、安全な版へ更新して回帰試験を行う
- Explanation: 利用箇所と影響範囲を確認し、安全な版への更新と回帰試験を行います。更新できない場合は代替策や利用停止も含めてリスクを管理します。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-201
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 災害対策拠点へバックアップを保管しているが、復旧手順を一度も試したことがない。最も適切な改善はどれか。
- Correct: 目標復旧時間と復旧時点を確認し、定期的に復元訓練を実施する
- Explanation: バックアップは復元できて初めて有効です。RTOとRPOを確認し、安全な訓練環境で定期的に復元手順を検証して改善します。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-203
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 社外の委託先へ顧客データを渡して分析を依頼する。分析には年代、地域、購入金額だけが必要で、氏名や電話番号は不要である。最も適切な対応はどれか。
- Correct: 必要な項目だけに絞り、識別情報を削除または仮名化し、利用目的と保管期限を契約で定める
- Explanation: データ最小化と委託先管理が必要です。不要な識別情報を渡さず、目的、保管、削除、アクセス制御を明確にします。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-204
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 公開サーバで管理画面のURLが推測され、外部から大量のログイン試行が発生している。現在はIDとパスワードだけでログインできる。優先して行う改善はどれか。
- Correct: 管理画面への接続元を制限し、多要素認証と試行回数制限を導入する
- Explanation: 管理機能は露出を減らし、認証を強化します。接続元制限、多要素認証、試行回数制限、ログ監視が有効です。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-205
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 従業員が私物クラウドへ業務ファイルを保存していた。ファイルには社外秘情報が含まれる。再発防止として最も適切なものはどれか。
- Correct: 許可された保存先と共有方法を定め、DLPやアクセス制御で持出しを検知・制限する
- Explanation: 情報の分類、許可された保管先、持出し制御、教育を組み合わせることで、意図しない漏えいを防ぎます。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢は、同じテクノロジ系でも役割や階層が異なる説明になっていることが多いです。目的、対象、入力と出力が問題文と合うかで除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: technology-208
- Stage: テクノロジ系
- Tag: 科目B長文セキュリティ
- Question: 標的型メールの訓練で、複数の従業員が添付ファイルを開いた。今後の対策として最も適切なものはどれか。
- Correct: 訓練結果を分析し、報告手順の周知、添付ファイル検査、教育を継続して行う
- Explanation: 訓練は弱点を把握して改善につなげるために行います。技術的対策と報告・教育の運用を継続します。 セキュリティ問題では、認証、暗号化、改ざん検知、アクセス制御、攻撃対策、監視のどれかを分けます。公開鍵暗号では暗号化に使う鍵と検証に使う鍵を混同しないことが重要です。 他の選択肢（メール訓練を二度と行わない）は、似た用語でも目的や対象が異なります。何を守るのか、何を変換するのか、どの装置や層で働くのかを比べます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-219
- Stage: テクノロジ系
- Tag: サンプル発展・ネットワーク
- Question: IPアドレスから対応するMACアドレスを求めるプロトコルはどれか。
- Correct: ARP
- Explanation: ARPは同一ネットワーク内でIPアドレスに対応するMACアドレスを問い合わせるプロトコルです。 ネットワーク問題では、名前解決、アドレス割当、アドレス変換、到達確認、通信制御、暗号化のどの役割かを先に分類します。似た略語は、何を入力にして何を得るかで区別します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: technology-223
- Stage: テクノロジ系
- Tag: サンプル発展・セキュリティ
- Question: Webアプリケーションへの攻撃を検知・防御する仕組みはどれか。
- Correct: WAF
- Explanation: WAFはHTTP通信を監視し、SQLインジェクションやXSSなどWebアプリケーションへの攻撃を検知・防御します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-078
- Stage: アルゴリズム
- Tag: 実戦トレース
- Question: キューを使う処理として適切なものはどれか。
- Correct: 印刷要求を受け付け順に処理する
- Explanation: 受け付け順に処理するのでFIFOが合います。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。 他の選択肢（整列済み配列を中央から探索する）は、似た用語でも前提条件や処理手順が異なります。問題文が求める取り出し順、探索条件、計算量と一致するかで切り分けます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-081
- Stage: アルゴリズム
- Tag: 実戦トレース
- Question: 同じ計算を何度も行う再帰を高速化するため、計算済み結果を保存して再利用する考え方はどれか。
- Correct: 計算済み結果を保存して再利用するメモ化
- Explanation: 計算済み結果を保存して再利用するメモ化が正解です。同じ引数に対する計算結果を保存し、再度必要になったとき再利用して重複計算を減らします。スプーリングは入出力の待ち時間対策、ミラーリングはデータ複製、射影は関係データベースから列を選ぶ操作です。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-088
- Stage: アルゴリズム
- Tag: データ構造
- Question: 「優先度が高いデータから取り出す構造」に該当する用語はどれか。
- Correct: 優先度付きキュー
- Explanation: 優先度付きキューは、優先度が高いデータから取り出す構造です。 単純なFIFOとは異なります。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-089
- Stage: アルゴリズム
- Tag: データ構造
- Question: 優先度付きキューの説明として適切なものはどれか。
- Correct: 最初に追加した要素を最初に取り出すFIFO方式のデータ構造
- Explanation: 優先度付きキューは、優先度が高いデータから取り出す構造です。 単純なFIFOとは異なります。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-090
- Stage: アルゴリズム
- Tag: データ構造
- Question: 優先度付きキューを見分ける特徴として最も適切なものはどれか。
- Correct: 優先度の高い要素から取り出す
- Explanation: 優先度付きキューでは「優先度で取り出し順が決まる」が重要です。単純なFIFOとは異なります。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-146
- Stage: アルゴリズム
- Tag: 擬似言語
- Question: 再帰の説明として適切なものはどれか。
- Correct: 処理の中で自分自身を呼び出す考え方です。
- Explanation: 再帰は、処理の中で自分自身を呼び出す考え方です。 終了条件が必須です。 再帰では、処理を止める終了条件と、問題を小さくして再び呼び出す部分を分けて確認します。終了条件がないと呼出しが積み重なり、スタックオーバーフローの原因になります。 他の選択肢は、似た処理でもデータの取り出し順、前提条件、計算量、使うデータ構造が異なります。問題文の動作条件と対応しないものを除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-161
- Stage: アルゴリズム
- Tag: 科目Bアルゴリズム
- Question: スタックへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。
- Correct: C、B
- Explanation: スタックはLIFOなので最後に入れたCから取り出します。 スタックは最後に入れた値を最初に取り出す構造です。pushした順序とpopされる順序が逆になるため、直前の状態を戻す処理や再帰呼出しの管理と結び付けて判断します。 他の選択肢（A、B、A、C、B、A）は、似た用語でも前提条件や処理手順が異なります。問題文が求める取り出し順、探索条件、計算量と一致するかで切り分けます。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-162
- Stage: アルゴリズム
- Tag: 科目Bアルゴリズム
- Question: キューへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。
- Correct: A、B
- Explanation: キューはFIFOなので先に入れたAから取り出します。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。 他の選択肢（A、C、B、A、B、C）は、似た用語でも前提条件や処理手順が異なります。問題文が求める取り出し順、探索条件、計算量と一致するかで切り分けます。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW possible-acronym-duplication

- ID: algorithm-172
- Stage: アルゴリズム
- Tag: データ構造応用
- Question: 到着順に印刷要求を処理するために適したデータ構造はどれか。
- Correct: キュー
- Explanation: 先着順処理にはFIFOのキューが適しています。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-197
- Stage: アルゴリズム
- Tag: 科目B長文アルゴリズム
- Question: 次の処理は、整列済み配列へ値を挿入する位置を探す。

array = [4, 9, 15, 22]
先頭から調べ、初めて挿入値以上となる要素の直前へ挿入する。該当要素がなければ末尾へ挿入する。

挿入値12を挿入した結果はどれか。
- Correct: [4, 9, 12, 15, 22]
- Explanation: 12以上となる最初の要素は15なので、その直前へ12を挿入します。 O(n)は、要素数に比例して処理回数が増える場合の計算量です。合計、件数カウント、線形探索のように、基本的に各要素を1回ずつ確認する処理で使います。 他の選択肢は、似た処理でもデータの取り出し順、前提条件、計算量、使うデータ構造が異なります。問題文の動作条件と対応しないものを除外します。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-208
- Stage: アルゴリズム
- Tag: 科目B長文アルゴリズム
- Question: 無向グラフに辺A-B、A-C、B-D、C-D、D-Eがある。Aから幅優先探索を行い、隣接頂点はアルファベット順に調べる。

頂点Eを訪問する直前に訪問される頂点はどれか。
- Correct: D
- Explanation: 訪問順はA、B、C、D、Eです。Eへ到達する直前の頂点はDです。 グラフ探索では、次に調べる候補をどの構造で管理するかが判断点です。幅優先探索はキュー、深さ優先探索はスタックや再帰と対応します。 他の選択肢（A、B、C）は、似た用語でも前提条件や処理手順が異なります。問題文が求める取り出し順、探索条件、計算量と一致するかで切り分けます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## LOW weak-distractor-explanation

- ID: algorithm-220
- Stage: アルゴリズム
- Tag: 科目B長文アルゴリズム
- Question: 次のキュー操作を順に行う。キューは先に入れた要素を先に取り出す。

初期キュー = [A, B]
1. Cを追加する
2. 1個取り出す
3. Dを追加する
4. 2個取り出す

最後にキューへ残る要素はどれか。
- Correct: D
- Explanation: C追加で[A,B,C]、1個取り出して[B,C]、D追加で[B,C,D]、2個取り出すとDだけが残ります。 キューは先に入れた値を先に取り出す構造です。受付順の処理、印刷待ち、幅優先探索の待ち行列のように、順番を保つ場面で使います。 他の選択肢（C、B, D、空）は、似た用語でも前提条件や処理手順が異なります。問題文が求める取り出し順、探索条件、計算量と一致するかで切り分けます。
- Detail: `{"reason":"誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。"}`

## MEDIUM weak-correct-reason

- ID: database-001
- Stage: データベース
- Tag: SQL
- Question: 表から条件に合う行を取り出すSQLの句はどれか。
- Correct: WHERE
- Explanation: WHERE句は行を抽出する条件を指定します。
- Detail: `{"explanationLength":21,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-001
- Stage: データベース
- Tag: SQL
- Question: 表から条件に合う行を取り出すSQLの句はどれか。
- Correct: WHERE
- Explanation: WHERE句は行を抽出する条件を指定します。
- Detail: `{"explanationLength":21,"minimum":32}`

## MEDIUM short-definition-explanation

- ID: database-002
- Stage: データベース
- Tag: キー
- Question: 表の各行を一意に識別するための項目はどれか。
- Correct: 主キー
- Explanation: 主キーは表内の各レコードを一意に識別する項目です。
- Detail: `{"explanationLength":24,"minimum":32}`

## LOW possible-acronym-duplication

- ID: database-004
- Stage: データベース
- Tag: トランザクション
- Question: ACID特性の A が表すものはどれか。
- Correct: Atomicity
- Explanation: ACIDのAはAtomicity、処理がすべて成功するか、すべて取り消される性質です。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## MEDIUM weak-correct-reason

- ID: database-007
- Stage: データベース
- Tag: SQL
- Question: 表に新しい行を追加するSQL命令はどれか。
- Correct: INSERT
- Explanation: INSERT文は表へ新しい行を追加します。
- Detail: `{"explanationLength":20,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-007
- Stage: データベース
- Tag: SQL
- Question: 表に新しい行を追加するSQL命令はどれか。
- Correct: INSERT
- Explanation: INSERT文は表へ新しい行を追加します。
- Detail: `{"explanationLength":20,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-010
- Stage: データベース
- Tag: キー
- Question: 外部キーの説明として最も適切なものはどれか。
- Correct: 他の表の主キーなどを参照して関連を表す項目
- Explanation: 参照整合性の維持に使われます。
- Detail: `{"explanationLength":14,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-010
- Stage: データベース
- Tag: キー
- Question: 外部キーの説明として最も適切なものはどれか。
- Correct: 他の表の主キーなどを参照して関連を表す項目
- Explanation: 参照整合性の維持に使われます。
- Detail: `{"explanationLength":14,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-011
- Stage: データベース
- Tag: キー
- Question: 候補キーの説明として最も適切なものはどれか。
- Correct: 行を一意に識別できる属性または属性の組
- Explanation: 主キーに選ばれ得るキーです。
- Detail: `{"explanationLength":13,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-011
- Stage: データベース
- Tag: キー
- Question: 候補キーの説明として最も適切なものはどれか。
- Correct: 行を一意に識別できる属性または属性の組
- Explanation: 主キーに選ばれ得るキーです。
- Detail: `{"explanationLength":13,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-012
- Stage: データベース
- Tag: キー
- Question: 複合キーの説明として最も適切なものはどれか。
- Correct: 複数列の組合せで行を一意に識別するキー
- Explanation: 単独列では一意にならない場合に使います。
- Detail: `{"explanationLength":19,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-012
- Stage: データベース
- Tag: キー
- Question: 複合キーの説明として最も適切なものはどれか。
- Correct: 複数列の組合せで行を一意に識別するキー
- Explanation: 単独列では一意にならない場合に使います。
- Detail: `{"explanationLength":19,"minimum":32}`

## LOW possible-acronym-duplication

- ID: database-013
- Stage: データベース
- Tag: 正規化
- Question: 第1正規形の説明として最も適切なものはどれか。
- Correct: 繰返し項目をなくし、各項目を単一の値にする形
- Explanation: 第1正規形は繰返し項目をなくし、一つの項目に複数の値を入れない形です。部分関数従属の排除は第2正規形、推移的関数従属の排除は第3正規形、全ての決定項を候補キーにするのはBCNFです。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`

## MEDIUM weak-correct-reason

- ID: database-016
- Stage: データベース
- Tag: トランザクション
- Question: コミットの説明として最も適切なものはどれか。
- Correct: トランザクションの更新を確定する処理
- Explanation: 確定後は更新が反映されます。
- Detail: `{"explanationLength":13,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-016
- Stage: データベース
- Tag: トランザクション
- Question: コミットの説明として最も適切なものはどれか。
- Correct: トランザクションの更新を確定する処理
- Explanation: 確定後は更新が反映されます。
- Detail: `{"explanationLength":13,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-017
- Stage: データベース
- Tag: トランザクション
- Question: ロールバックの説明として最も適切なものはどれか。
- Correct: トランザクション中の更新を取り消す処理
- Explanation: 障害時などに整合性を保ちます。
- Detail: `{"explanationLength":14,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-017
- Stage: データベース
- Tag: トランザクション
- Question: ロールバックの説明として最も適切なものはどれか。
- Correct: トランザクション中の更新を取り消す処理
- Explanation: 障害時などに整合性を保ちます。
- Detail: `{"explanationLength":14,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-018
- Stage: データベース
- Tag: トランザクション
- Question: 一貫性の説明として最も適切なものはどれか。
- Correct: 処理の前後でデータベースの整合条件が守られる性質
- Explanation: ACIDのCです。
- Detail: `{"explanationLength":8,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-018
- Stage: データベース
- Tag: トランザクション
- Question: 一貫性の説明として最も適切なものはどれか。
- Correct: 処理の前後でデータベースの整合条件が守られる性質
- Explanation: ACIDのCです。
- Detail: `{"explanationLength":8,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-019
- Stage: データベース
- Tag: トランザクション
- Question: 独立性の説明として最も適切なものはどれか。
- Correct: 同時実行する処理が互いに不当に影響しない性質
- Explanation: ACIDのIです。
- Detail: `{"explanationLength":8,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-019
- Stage: データベース
- Tag: トランザクション
- Question: 独立性の説明として最も適切なものはどれか。
- Correct: 同時実行する処理が互いに不当に影響しない性質
- Explanation: ACIDのIです。
- Detail: `{"explanationLength":8,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-020
- Stage: データベース
- Tag: トランザクション
- Question: 耐久性の説明として最も適切なものはどれか。
- Correct: 確定した更新が障害後も失われない性質
- Explanation: ACIDのDです。
- Detail: `{"explanationLength":8,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-020
- Stage: データベース
- Tag: トランザクション
- Question: 耐久性の説明として最も適切なものはどれか。
- Correct: 確定した更新が障害後も失われない性質
- Explanation: ACIDのDです。
- Detail: `{"explanationLength":8,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-021
- Stage: データベース
- Tag: 設計
- Question: ER図の説明として最も適切なものはどれか。
- Correct: 実体と関連を表してデータ構造を設計する図
- Explanation: 概念データモデルを表します。
- Detail: `{"explanationLength":13,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-021
- Stage: データベース
- Tag: 設計
- Question: ER図の説明として最も適切なものはどれか。
- Correct: 実体と関連を表してデータ構造を設計する図
- Explanation: 概念データモデルを表します。
- Detail: `{"explanationLength":13,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-022
- Stage: データベース
- Tag: 設計
- Question: カーディナリティの説明として最も適切なものはどれか。
- Correct: エンティティ間の対応数を表すもの
- Explanation: 1対多、多対多などを示します。
- Detail: `{"explanationLength":13,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-022
- Stage: データベース
- Tag: 設計
- Question: カーディナリティの説明として最も適切なものはどれか。
- Correct: エンティティ間の対応数を表すもの
- Explanation: 1対多、多対多などを示します。
- Detail: `{"explanationLength":13,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-023
- Stage: データベース
- Tag: 運用
- Question: ログの説明として最も適切なものはどれか。
- Correct: 更新履歴や操作履歴を記録したもの
- Explanation: 障害解析や復旧に利用されます。
- Detail: `{"explanationLength":14,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-023
- Stage: データベース
- Tag: 運用
- Question: ログの説明として最も適切なものはどれか。
- Correct: 更新履歴や操作履歴を記録したもの
- Explanation: 障害解析や復旧に利用されます。
- Detail: `{"explanationLength":14,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-024
- Stage: データベース
- Tag: 運用
- Question: 差分バックアップの説明として最も適切なものはどれか。
- Correct: 前回のフルバックアップ以降の変更分を保存する方式
- Explanation: 復旧にはフルバックアップと最新差分が必要です。
- Detail: `{"explanationLength":22,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-024
- Stage: データベース
- Tag: 運用
- Question: 差分バックアップの説明として最も適切なものはどれか。
- Correct: 前回のフルバックアップ以降の変更分を保存する方式
- Explanation: 復旧にはフルバックアップと最新差分が必要です。
- Detail: `{"explanationLength":22,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-025
- Stage: データベース
- Tag: 運用
- Question: 増分バックアップの説明として最も適切なものはどれか。
- Correct: 前回バックアップ以降の変更分だけを保存する方式
- Explanation: 保存量は少ないが復旧時に複数バックアップが必要な場合があります。
- Detail: `{"explanationLength":31,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-025
- Stage: データベース
- Tag: 運用
- Question: 増分バックアップの説明として最も適切なものはどれか。
- Correct: 前回バックアップ以降の変更分だけを保存する方式
- Explanation: 保存量は少ないが復旧時に複数バックアップが必要な場合があります。
- Detail: `{"explanationLength":31,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-026
- Stage: データベース
- Tag: 排他制御
- Question: 共有ロックの説明として最も適切なものはどれか。
- Correct: 他トランザクションの参照は許すが更新を制限するロック
- Explanation: 読み取り時の整合性確保に使います。
- Detail: `{"explanationLength":16,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-026
- Stage: データベース
- Tag: 排他制御
- Question: 共有ロックの説明として最も適切なものはどれか。
- Correct: 他トランザクションの参照は許すが更新を制限するロック
- Explanation: 読み取り時の整合性確保に使います。
- Detail: `{"explanationLength":16,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-027
- Stage: データベース
- Tag: 排他制御
- Question: 専有ロックの説明として最も適切なものはどれか。
- Correct: 他トランザクションの参照や更新を制限するロック
- Explanation: 更新時の競合防止に使います。
- Detail: `{"explanationLength":13,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-027
- Stage: データベース
- Tag: 排他制御
- Question: 専有ロックの説明として最も適切なものはどれか。
- Correct: 他トランザクションの参照や更新を制限するロック
- Explanation: 更新時の競合防止に使います。
- Detail: `{"explanationLength":13,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-028
- Stage: データベース
- Tag: 排他制御
- Question: デッドロックの説明として最も適切なものはどれか。
- Correct: 複数の処理が互いの資源解放を待ち続け、進行できない状態
- Explanation: DBでも発生し得ます。
- Detail: `{"explanationLength":10,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-028
- Stage: データベース
- Tag: 排他制御
- Question: デッドロックの説明として最も適切なものはどれか。
- Correct: 複数の処理が互いの資源解放を待ち続け、進行できない状態
- Explanation: DBでも発生し得ます。
- Detail: `{"explanationLength":10,"minimum":32}`

## MEDIUM weak-correct-reason

- ID: database-029
- Stage: データベース
- Tag: 頻出SQL
- Question: 社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。
- Correct: WHERE
- Explanation: 行の抽出条件はWHERE句で指定します。
- Detail: `{"explanationLength":19,"reason":"正解名だけ、または汎用文だけで理由が不足している可能性があります。"}`

## MEDIUM short-definition-explanation

- ID: database-029
- Stage: データベース
- Tag: 頻出SQL
- Question: 社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。
- Correct: WHERE
- Explanation: 行の抽出条件はWHERE句で指定します。
- Detail: `{"explanationLength":19,"minimum":32}`

## LOW possible-acronym-duplication

- ID: database-029
- Stage: データベース
- Tag: 頻出SQL
- Question: 社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。
- Correct: WHERE
- Explanation: 行の抽出条件はWHERE句で指定します。
- Detail: `{"reason":"略語補足と既存解説の内容が重複する可能性があります。"}`
