# 選択肢候補 品質監査レポート

生成日時: 2026-06-13T22:25:49.771Z

- 全問題数: 804
- 要確認問題数: 225
- 高確度の指摘: 0
- 中確度の指摘: 119
- 参考指摘: 222

## 判定件数

- choice-style-outlier: 100
- foreign-tag-candidate: 232
- near-correct-candidate: 6
- mixed-choice-styles: 1
- correct-length-outlier: 2

## 優先確認キュー

| 順位 | 点数 | 分野 | タグ | 問題 | 指摘 |
| ---: | ---: | --- | --- | --- | --- |
| 1 | 15 | ストラテジ系 | 標準化 | 企業活動の継続能力を高めるための計画はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: RPO / foreign-tag-candidate: SLA |
| 2 | 14 | アルゴリズム | 科目B長文アルゴリズム | 無向グラフに辺A-B、A-C、B-D、C-D、D-Eがある。Aから幅優先探索を行い、隣接頂点はアルファベット順に調べる。  頂点Eを訪問する直前に訪問される頂点はどれか。 | choice-style-outlier: 訪問される頂点はない / foreign-tag-candidate: C / foreign-tag-candidate: B / foreign-tag-candidate: A |
| 3 | 13 | テクノロジ系 | バックアップ設計 | 毎日0時にバックアップを取得する。障害が18時に起きた場合、最大18時間分の更新が失われ得る。この指標はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: MTTR / foreign-tag-candidate: SLA |
| 4 | 12 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、整列済み配列へ値を挿入する位置を探す。  array = [4, 9, 15, 22] 先頭から調べ、初めて挿入値以上となる要素の直前へ挿入する。該当要素がなければ末尾へ挿入する。  挿入値12を挿入した結果はどれか。 | near-correct-candidate: [4, 9, 15, 22, 12] / near-correct-candidate: [4, 9, 12, 22, 15] |
| 5 | 11 | アルゴリズム | 条件分岐 | x=7のとき、xが10以上ならA、5以上ならB、それ以外ならCを出力する。結果はどれか。 | choice-style-outlier: 何も出力しない / foreign-tag-candidate: A / foreign-tag-candidate: C |
| 6 | 11 | データベース | トランザクション | コミットの説明として最も適切なものはどれか。 | choice-style-outlier: 未確定の更新を取り消す処理 / foreign-tag-candidate: 他トランザクションの参照は許すが更新を制限するロック / foreign-tag-candidate: 他トランザクションの参照や更新を制限するロック |
| 7 | 9 | アルゴリズム | 探索 | 昇順に整列済みの配列から値を探すとき、二分探索の平均的な計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(n) / foreign-tag-candidate: O(n log n) |
| 8 | 9 | アルゴリズム | スタック | スタックのデータ取り出し方式を表すものはどれか。 | foreign-tag-candidate: キュー / foreign-tag-candidate: FIFO / foreign-tag-candidate: 優先度付きキュー |
| 9 | 9 | アルゴリズム | キュー | キューのデータ取り出し方式を表すものはどれか。 | foreign-tag-candidate: スタック / foreign-tag-candidate: LIFO / foreign-tag-candidate: 優先度付きキュー |
| 10 | 9 | アルゴリズム | 木構造 | 二分探索木で、左部分木に置かれる値として一般に適切なものはどれか。 | foreign-tag-candidate: 線形探索 / foreign-tag-candidate: 二分探索 / foreign-tag-candidate: ハッシュ探索 |
| 11 | 9 | アルゴリズム | トレース | n個の配列を先頭から最後まで1回ずつ調べる処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n log n) |
| 12 | 9 | アルゴリズム | トレース | n個の配列を二重ループですべての組合せに近い形で比較する処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n log n) |
| 13 | 9 | アルゴリズム | 実戦トレース | 隣接する要素を比較し、必要なら交換する整列法はどれか。 | foreign-tag-candidate: 選択ソート / foreign-tag-candidate: 挿入ソート / foreign-tag-candidate: クイックソート |
| 14 | 9 | アルゴリズム | 実戦トレース | グラフの最短手数を調べるとき、重みがない場合に使いやすい探索はどれか。 | foreign-tag-candidate: 線形探索 / foreign-tag-candidate: 二分探索 / foreign-tag-candidate: ハッシュ探索 |
| 15 | 9 | アルゴリズム | 擬似言語 | 「部分問題の結果を利用して全体の解を求める手法」に該当する用語はどれか。 | foreign-tag-candidate: スタック / foreign-tag-candidate: キュー / foreign-tag-candidate: 優先度付きキュー |
| 16 | 9 | アルゴリズム | 計算量判断 | n個の要素を1回ずつ確認して最大値を求める処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n²) |
| 17 | 9 | データベース | 頻出SQL | 社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。 | foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY / foreign-tag-candidate: ORDER BY |
| 18 | 9 | データベース | SQL読解 | 注文表で注文IDだけでは商品を一意に識別できず、注文IDと商品IDの組で一意になる。このキーはどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 19 | 9 | データベース | SQL読解 | 商品名が商品IDに依存し、注文IDには依存しない。注文IDと商品IDの複合キー表で起きる問題はどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 20 | 9 | データベース | SQL読解 | 部署名が部署IDに依存し、社員IDから部署IDが決まるとき、社員IDから部署名が間接的に決まる関係はどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 21 | 9 | データベース | SQL読解 | 更新途中のデータを他の処理が読まないようにする制御として適切なものはどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 22 | 9 | データベース | SQL読解 | 誤って更新した直後、まだCOMMITしていない。更新を取り消す操作はどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 23 | 9 | データベース | SQL読解 | 検索頻度が高い列にインデックスを作成する主な効果はどれか。 | foreign-tag-candidate: WHERE / foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 24 | 9 | データベース | 正規化 | 「推移的関数従属を取り除いた形」に該当する用語はどれか。 | foreign-tag-candidate: COMMIT / foreign-tag-candidate: ROLLBACK / foreign-tag-candidate: 共有ロック |
| 25 | 9 | データベース | トランザクション | 「他処理の参照は許すが更新を制限するロック」に該当する用語はどれか。 | foreign-tag-candidate: SELECT / foreign-tag-candidate: INSERT / foreign-tag-candidate: UPDATE |
| 26 | 9 | マネジメント系 | 頻出管理 | SLAで主に合意するものはどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 問題管理 / foreign-tag-candidate: 変更管理 |
| 27 | 9 | マネジメント系 | 開発・運用 | リグレッションテストの目的はどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 28 | 9 | マネジメント系 | 開発・運用 | 負荷テストの目的はどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 29 | 9 | マネジメント系 | ケース問題 | 受入テストで主に確認することはどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 30 | 9 | マネジメント系 | 可用性 | 「障害時に待機系へ処理を引き継ぐ仕組み」に該当する用語はどれか。 | foreign-tag-candidate: ウォータフォールモデル / foreign-tag-candidate: アジャイル開発 / foreign-tag-candidate: プロトタイピング |
| 31 | 9 | マネジメント系 | 可用性 | フェールオーバの説明として適切なものはどれか。 | foreign-tag-candidate: 工程を上流から下流へ順に進める開発モデルです。 / foreign-tag-candidate: 短い反復で開発と改善を進める手法です。 / foreign-tag-candidate: 試作品を作り利用者の確認を得ながら進める手法です。 |
| 32 | 9 | マネジメント系 | 可用性 | フェールオーバを見分ける特徴として最も適切なものはどれか。 | foreign-tag-candidate: 工程を順番に進める / foreign-tag-candidate: 短い反復で改善する / foreign-tag-candidate: 試作品で要求を確認する |
| 33 | 9 | ストラテジ系 | 経営頻出 | サブスクリプションモデルの説明はどれか。 | foreign-tag-candidate: 市場を顧客属性やニーズで細分化すること / foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: ある時点の資産・負債・純資産を示す財務諸表 |
| 34 | 9 | ストラテジ系 | 経営頻出 | フリーミアムの説明はどれか。 | foreign-tag-candidate: 市場を顧客属性やニーズで細分化すること / foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: ある時点の資産・負債・純資産を示す財務諸表 |
| 35 | 9 | ストラテジ系 | 経営頻出 | KPIの説明はどれか。 | foreign-tag-candidate: 市場を顧客属性やニーズで細分化すること / foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: ある時点の資産・負債・純資産を示す財務諸表 |
| 36 | 9 | ストラテジ系 | 経営頻出 | KGIの説明はどれか。 | foreign-tag-candidate: 市場を顧客属性やニーズで細分化すること / foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: ある時点の資産・負債・純資産を示す財務諸表 |
| 37 | 9 | ストラテジ系 | 実戦ケース | RFPを提示する目的として適切なものはどれか。 | foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: 顧客情報を活用して顧客関係を管理する考え方やシステム / foreign-tag-candidate: 調達から販売までの供給連鎖を管理する考え方 |
| 38 | 9 | ストラテジ系 | 実戦ケース | SaaSの例として適切なものはどれか。 | foreign-tag-candidate: 企業全体の経営資源を統合的に管理するシステム / foreign-tag-candidate: 顧客情報を活用して顧客関係を管理する考え方やシステム / foreign-tag-candidate: 調達から販売までの供給連鎖を管理する考え方 |
| 39 | 9 | テクノロジ系 | 実戦問題 | 社外から社内システムへ安全に接続するために使う技術として適切なものはどれか。 | foreign-tag-candidate: DNS / foreign-tag-candidate: TCP / foreign-tag-candidate: UDP |
| 40 | 9 | テクノロジ系 | セキュリティ | 「入力値にSQLの断片を混入して不正操作する攻撃」に該当する用語はどれか。 | foreign-tag-candidate: CPU / foreign-tag-candidate: レジスタ / foreign-tag-candidate: ALU |
| 41 | 9 | テクノロジ系 | サンプル発展・セキュリティ | Webアプリケーションへの攻撃を検知・防御する仕組みはどれか。 | foreign-tag-candidate: NAT / foreign-tag-candidate: DNS / foreign-tag-candidate: DHCP |
| 42 | 8 | アルゴリズム | 擬似言語 | 添字の説明として最も適切なものはどれか。 | choice-style-outlier: 配列の要素位置を示す値 / foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 43 | 8 | アルゴリズム | 頻出処理 | 空のスタックに A, B, C の順にpushし、1回popしたとき取り出されるものはどれか。 | choice-style-outlier: 何も取り出せない / foreign-tag-candidate: B |
| 44 | 8 | アルゴリズム | 頻出処理 | 空のキューに A, B, C の順にenqueueし、1回dequeueしたとき取り出されるものはどれか。 | choice-style-outlier: 何も取り出せない / foreign-tag-candidate: B |
| 45 | 8 | アルゴリズム | 条件分岐 | a=true、b=falseのとき、a AND NOT bの値はどれか。 | choice-style-outlier: 0とは限らない / foreign-tag-candidate: false |
| 46 | 8 | アルゴリズム | サンプル発展・アルゴリズム | 配列の各要素の出現回数を効率よく数えるために適したデータ構造はどれか。 | choice-style-outlier: キーと回数を対応付ける連想配列 / foreign-tag-candidate: 優先度付きキュー |
| 47 | 8 | ストラテジ系 | 法務 | 不正アクセス禁止法の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 / foreign-tag-candidate: 法令や社会規範を守る考え方 |
| 48 | 8 | ストラテジ系 | 法務 | 個人情報保護の説明として適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 / foreign-tag-candidate: 法令や社会規範を守る考え方 |
| 49 | 8 | テクノロジ系 | 頻出計算 | 平均故障間隔を表す指標はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: RPO |
| 50 | 8 | テクノロジ系 | 頻出計算 | 平均修復時間を表す指標はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: RPO |
| 51 | 6 | アルゴリズム | アルゴリズム | 幅優先探索の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 / foreign-tag-candidate: 整列済みデータの中央と比較して探索範囲を半分にする方法 |
| 52 | 6 | アルゴリズム | アルゴリズム | 深さ優先探索の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 / foreign-tag-candidate: 整列済みデータの中央と比較して探索範囲を半分にする方法 |
| 53 | 6 | アルゴリズム | データ構造 | スタックを見分ける特徴として最も適切なものはどれか。 | near-correct-candidate: 先入れ先出しで要素を管理する |
| 54 | 6 | アルゴリズム | データ構造 | キューを見分ける特徴として最も適切なものはどれか。 | near-correct-candidate: 後入れ先出しで要素を管理する |
| 55 | 6 | アルゴリズム | 擬似言語 | 「計算済み結果を保存して再利用する考え方」に該当する用語はどれか。 | foreign-tag-candidate: スタック / foreign-tag-candidate: キュー |
| 56 | 6 | アルゴリズム | グラフ問題 | 重み付きグラフで全ての辺の重みが非負のとき、単一始点最短経路を求める代表的手法はどれか。 | foreign-tag-candidate: バブルソート / foreign-tag-candidate: 二分探索 |
| 57 | 6 | アルゴリズム | 計算量判断 | 外側がn回、内側が常に10回の二重ループの計算量はどれか。 | foreign-tag-candidate: O(n²) / foreign-tag-candidate: O(log n) |
| 58 | 6 | アルゴリズム | 科目B長文アルゴリズム | 次の処理でキューを操作する。キューは先入れ先出しである。  1. A、B、Cをこの順に追加する。 2. 先頭から1個取り出す。 3. Dを追加する。 4. 先頭から2個取り出す。  手順4で取り出される二つの値はどれか。 | foreign-tag-candidate: A、B / foreign-tag-candidate: C、B |
| 59 | 6 | データベース | 排他制御 | 複数の利用者が同じデータを同時更新して矛盾が起きるのを防ぐ仕組みはどれか。 | foreign-tag-candidate: COMMIT / foreign-tag-candidate: ROLLBACK |
| 60 | 6 | データベース | 頻出SQL | 主キーに設定できない値はどれか。 | foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 61 | 6 | データベース | 頻出SQL | トランザクションの途中で障害が起きた場合、更新を取り消す処理はどれか。 | foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY |
| 62 | 6 | データベース | 正規化 | 「部分関数従属を取り除いた形」に該当する用語はどれか。 | foreign-tag-candidate: COMMIT / foreign-tag-candidate: ROLLBACK |
| 63 | 6 | データベース | トランザクション | 「未確定の更新を取り消す処理」に該当する用語はどれか。 | foreign-tag-candidate: SELECT / foreign-tag-candidate: INSERT |
| 64 | 6 | データベース | 複合ケース | 注文表と顧客表から、注文がない顧客も含めて一覧表示したい。適切な結合はどれか。 | near-correct-candidate: 注文表を左側にしたLEFT OUTER JOIN |
| 65 | 6 | データベース | 複合ケース | 商品ごとの売上合計が10万円以上の商品だけを表示したい。集計後の条件指定に使う句はどれか。 | foreign-tag-candidate: ORDER BY / foreign-tag-candidate: INSERT |
| 66 | 6 | マネジメント系 | 見積り | プロジェクトの進捗を、計画価値・出来高・実コストで管理する手法はどれか。 | foreign-tag-candidate: ガントチャート / foreign-tag-candidate: WBS |
| 67 | 6 | マネジメント系 | 頻出管理 | 計画価値をPV、出来高をEV、実コストをACとして管理する手法はどれか。 | foreign-tag-candidate: ガントチャート / foreign-tag-candidate: WBS |
| 68 | 6 | マネジメント系 | ケース問題 | 障害を早く復旧した後、根本原因を分析して再発防止する活動はどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 構成管理 |
| 69 | 6 | マネジメント系 | 開発 | 「変更を頻繁に統合し自動ビルドやテストを行う取組み」に該当する用語はどれか。 | correct-length-outlier |
| 70 | 6 | マネジメント系 | サンプル発展・テスト | プログラム内部の分岐や命令を確認してテストケースを設計する方法はどれか。 | foreign-tag-candidate: 受入テスト / foreign-tag-candidate: レビュー |
| 71 | 6 | ストラテジ系 | 知的財産 | ソフトウェアのプログラムそのものを保護する代表的な権利はどれか。 | foreign-tag-candidate: 特許権 / foreign-tag-candidate: 商標権 |
| 72 | 6 | ストラテジ系 | マーケティング | プロダクトライフサイクルの説明として最も適切なものはどれか。 | foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 / foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 |
| 73 | 6 | ストラテジ系 | マーケティング | ロングテールの説明として最も適切なものはどれか。 | foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 / foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 |
| 74 | 6 | ストラテジ系 | 経営頻出 | ベンチマーキングの説明はどれか。 | foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 / foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 |
| 75 | 6 | ストラテジ系 | 経営頻出 | コンプライアンスの説明はどれか。 | foreign-tag-candidate: 特定の個人を識別できる情報を適切に扱う考え方 / foreign-tag-candidate: 他人の認証情報を使った不正ログインなどを禁じる法律 |
| 76 | 6 | ストラテジ系 | 実戦ケース | 他社の登録商標を自社商品名として無断使用した場合に問題となる権利はどれか。 | foreign-tag-candidate: 著作権 / foreign-tag-candidate: 特許権 |
| 77 | 6 | ストラテジ系 | 経営戦略 | 「市場成長率と市場占有率で事業を分類する手法」に該当する用語はどれか。 | correct-length-outlier |
| 78 | 6 | ストラテジ系 | 複合ケース | 売上高800万円、変動費500万円、固定費200万円の利益はどれか。 | near-correct-candidate: 1,000万円 |
| 79 | 6 | テクノロジ系 | セキュリティ | TLSの説明として最も適切なものはどれか。 | foreign-tag-candidate: ドメイン名とIPアドレスを対応付ける仕組み / foreign-tag-candidate: 公衆網上に仮想的な専用通信路を作る技術 |
| 80 | 6 | テクノロジ系 | セキュリティ | 「Webアプリケーションへの攻撃を検知・防御する仕組み」に該当する用語はどれか。 | foreign-tag-candidate: CPU / foreign-tag-candidate: レジスタ |
| 81 | 6 | テクノロジ系 | サンプル発展・ネットワーク | IPアドレスから対応するMACアドレスを求めるプロトコルはどれか。 | foreign-tag-candidate: DNS / foreign-tag-candidate: DHCP |
| 82 | 5 | アルゴリズム | 論理 | 否定の説明として最も適切なものはどれか。 | choice-style-outlier: 真偽を反転させる演算 |
| 83 | 5 | アルゴリズム | トレース | 空のスタックに 1, 2 をpushし、popした値を a に入れる。a はどれか。 | choice-style-outlier: 値を取り出せない |
| 84 | 5 | アルゴリズム | トレース | 配列[8, 2, 5]を先頭から見て、最初に5より小さい値はどれか。 | choice-style-outlier: 該当する値はない |
| 85 | 5 | アルゴリズム | 実戦トレース | 配列[1, 2, 3, 4, 5]から偶数だけを取り出すとどれか。 | foreign-tag-candidate: [4, 5] |
| 86 | 5 | アルゴリズム | 実戦トレース | キューを使う処理として適切なものはどれか。 | choice-style-outlier: 直前の状態へ戻るUndo処理 |
| 87 | 5 | アルゴリズム | 実戦トレース | 同じ計算を何度も行う再帰を高速化するため、計算済み結果を保存して再利用する考え方はどれか。 | choice-style-outlier: 必要な列だけを取り出す射影 |
| 88 | 5 | アルゴリズム | データ構造 | 二分木を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 各節が最大二つの子を持つ |
| 89 | 5 | アルゴリズム | 探索 | 線形探索を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: キーから位置を計算する |
| 90 | 5 | アルゴリズム | 探索 | 二分探索を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: キーから位置を計算する |
| 91 | 5 | アルゴリズム | 探索 | ハッシュ探索を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: キーから位置を計算する |
| 92 | 5 | アルゴリズム | 探索 | 深さ優先探索を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: キーから位置を計算する |
| 93 | 5 | アルゴリズム | 整列 | バブルソートを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 基準値で左右に分ける |
| 94 | 5 | アルゴリズム | 整列 | 選択ソートを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 基準値で左右に分ける |
| 95 | 5 | アルゴリズム | 整列 | 挿入ソートを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 基準値で左右に分ける |
| 96 | 5 | アルゴリズム | 整列 | クイックソートを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 基準値で左右に分ける |
| 97 | 5 | アルゴリズム | 計算量 | O(1)を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 件数に左右されない |
| 98 | 5 | アルゴリズム | 計算量 | O(n)を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 件数に左右されない |
| 99 | 5 | アルゴリズム | 計算量 | O(n log n)を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 件数に左右されない |
| 100 | 5 | アルゴリズム | 計算量 | O(n²)を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 件数に左右されない |
| 101 | 5 | アルゴリズム | 擬似言語 | メモ化を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 自分自身を呼び出す |
| 102 | 5 | アルゴリズム | 擬似言語 | 動的計画法を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 自分自身を呼び出す |
| 103 | 5 | アルゴリズム | 計算量判断 | 探索範囲を毎回半分にする処理で、要素数が2倍になったとき比較回数は概ねどうなるか。 | choice-style-outlier: 約1回増える |
| 104 | 5 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、行列の各行の合計が最大となる行番号を求める。行番号は1から始まる。  行列 = [[2, 4, 1], [5, 1, 3], [3, 3, 2]] 各行の合計を求め、これまでの最大値より大きい場合だけ行番号を更新する。  最終的な行番号はどれか。 | mixed-choice-styles |
| 105 | 5 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、整数nが素数かを判定する。2からn-1までの値でnを割り、割り切れる値が一つでもあれば素数ではないとする。  n = 15のとき、最初に割り切れる値はどれか。 | choice-style-outlier: 割り切れる値はない |
| 106 | 5 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、文字列を左から読み、数字の文字だけを順に連結する。  入力文字列 = A1B23C4 数字ならresultの末尾へ追加し、それ以外は何もしない。  処理終了時のresultはどれか。 | choice-style-outlier: A1B23C4 |
| 107 | 5 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、循環配列の次の位置を求める。配列の要素数は5で、次の位置は (現在位置 + 1) mod 5 とする。  現在位置が4のとき、次の位置はどれか。 | choice-style-outlier: 位置は存在しない |
| 108 | 5 | アルゴリズム | サンプル発展・アルゴリズム | 深さ優先探索を反復処理で実装するとき、次に訪問する頂点の管理に適したデータ構造はどれか。 | foreign-tag-candidate: キャッシュメモリ |
| 109 | 5 | データベース | バックアップ | 障害発生時にデータベースを復旧するために重要なものはどれか。 | choice-style-outlier: バックアップとログ |
| 110 | 5 | データベース | キー | 外部キーの説明として最も適切なものはどれか。 | choice-style-outlier: 列の値の重複を防ぐための制約 |
| 111 | 5 | データベース | キー | 候補キーの説明として最も適切なものはどれか。 | choice-style-outlier: 列の値の重複を防ぐための制約 |
| 112 | 5 | マネジメント系 | 開発 | ウォータフォールモデルを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 工程を順番に進める |
| 113 | 5 | マネジメント系 | 開発 | プロトタイピングを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 工程を順番に進める |
| 114 | 5 | マネジメント系 | 開発 | DevOpsを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 工程を順番に進める |
| 115 | 5 | マネジメント系 | 開発 | CIを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 工程を順番に進める |
| 116 | 5 | マネジメント系 | プロジェクト | ガントチャートを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: PV・EV・ACで管理する |
| 117 | 5 | マネジメント系 | プロジェクト | クリティカルパスを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: PV・EV・ACで管理する |
| 118 | 5 | マネジメント系 | プロジェクト | CPIを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 作業を分解する |
| 119 | 5 | マネジメント系 | プロジェクト | SPIを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 作業を分解する |
| 120 | 5 | マネジメント系 | サンプル発展・設計 | 一つのモジュールが一つの明確な役割へ集中している状態として望ましいものはどれか。 | choice-style-outlier: 機能が無関係に混在する |
| 121 | 5 | ストラテジ系 | システム企画 | 情報システム導入の投資効果を評価する指標として適切なものはどれか。 | foreign-tag-candidate: DHCP |
| 122 | 5 | ストラテジ系 | 法務 | 著作権の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 123 | 5 | ストラテジ系 | 法務 | 特許権の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 124 | 5 | ストラテジ系 | 法務 | 商標権の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 125 | 5 | ストラテジ系 | 法務 | 派遣契約の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 126 | 5 | ストラテジ系 | 法務 | 請負契約の説明として最も適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 127 | 5 | ストラテジ系 | 経営戦略 | SWOT分析を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 顧客・競合・自社を見る |
| 128 | 5 | ストラテジ系 | 経営戦略 | 3C分析を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 顧客・競合・自社を見る |
| 129 | 5 | ストラテジ系 | 経営戦略 | バリューチェーンを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 顧客・競合・自社を見る |
| 130 | 5 | ストラテジ系 | 経営戦略 | コアコンピタンスを見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 顧客・競合・自社を見る |
| 131 | 5 | ストラテジ系 | 会計 | 営業利益の説明として適切なものはどれか。 | choice-style-outlier: 本業で得た利益を表す指標です。 |
| 132 | 5 | ストラテジ系 | 会計 | 営業利益を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 量に応じて増減する |
| 133 | 5 | ストラテジ系 | 会計 | 固定費を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 量に応じて増減する |
| 134 | 5 | ストラテジ系 | 会計 | 変動費を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 量に応じて増減する |
| 135 | 5 | ストラテジ系 | 法務 | 「創作的な表現を保護する権利」に該当する用語はどれか。 | choice-style-outlier: 個人情報保護 |
| 136 | 5 | ストラテジ系 | 法務 | 著作権の説明として適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 137 | 5 | ストラテジ系 | 法務 | 「発明を保護する産業財産権」に該当する用語はどれか。 | choice-style-outlier: 個人情報保護 |
| 138 | 5 | ストラテジ系 | 法務 | 特許権の説明として適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 139 | 5 | ストラテジ系 | 法務 | 「商品やサービスの識別標識を保護する権利」に該当する用語はどれか。 | choice-style-outlier: 個人情報保護 |
| 140 | 5 | ストラテジ系 | 法務 | 商標権の説明として適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 141 | 5 | ストラテジ系 | 法務 | 「特定の個人を識別できる情報を適切に扱う考え方」に該当する用語はどれか。 | choice-style-outlier: 個人情報保護 |
| 142 | 5 | ストラテジ系 | 法務 | 派遣契約の説明として適切なものはどれか。 | choice-style-outlier: 発明を保護する産業財産権 |
| 143 | 5 | ストラテジ系 | 法務 | 派遣契約を見分ける特徴として最も適切なものはどれか。 | choice-style-outlier: 仕事の完成に責任を負う |
| 144 | 5 | テクノロジ系 | CPU | CPUのクロック周波数が高いほど、一般に何が増えるか。 | choice-style-outlier: 主記憶へ保存できるデータ量 |
| 145 | 5 | テクノロジ系 | 基礎理論 | 標本化の説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
| 146 | 5 | テクノロジ系 | 基礎理論 | 量子化の説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
| 147 | 5 | テクノロジ系 | 基礎理論 | パリティビットの説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
| 148 | 5 | テクノロジ系 | 基礎理論 | ハミング距離の説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
| 149 | 5 | テクノロジ系 | 基礎理論 | 浮動小数点数の説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
| 150 | 5 | テクノロジ系 | 基礎理論 | 補数の説明として最も適切なものはどれか。 | choice-style-outlier: 値を有限個の段階へ丸める処理 |
