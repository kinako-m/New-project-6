# 選択肢候補 品質監査レポート

生成日時: 2026-06-18T14:51:13.408Z

- 全問題数: 804
- 要確認問題数: 113
- 高確度の指摘: 0
- 中確度の指摘: 6
- 参考指摘: 171

## 判定件数

- foreign-tag-candidate: 177

## 優先確認キュー

| 順位 | 点数 | 分野 | タグ | 問題 | 指摘 |
| ---: | ---: | --- | --- | --- | --- |
| 1 | 12 | アルゴリズム | 探索 | 昇順に整列済みの配列から値を探すとき、二分探索の平均的な計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(n) / foreign-tag-candidate: O(n log n) / foreign-tag-candidate: O(n²) |
| 2 | 12 | アルゴリズム | 実戦トレース | 隣接する要素を比較し、必要なら交換する整列法はどれか。 | foreign-tag-candidate: 選択ソート / foreign-tag-candidate: 挿入ソート / foreign-tag-candidate: クイックソート / foreign-tag-candidate: マージソート |
| 3 | 12 | アルゴリズム | 実戦トレース | グラフの最短手数を調べるとき、重みがない場合に使いやすい探索はどれか。 | foreign-tag-candidate: 線形探索 / foreign-tag-candidate: 二分探索 / foreign-tag-candidate: ハッシュ探索 / foreign-tag-candidate: 深さ優先探索 |
| 4 | 12 | アルゴリズム | 条件分岐 | x=7のとき、xが10以上ならA、5以上ならB、それ以外ならCを出力する。結果はどれか。 | foreign-tag-candidate: A / foreign-tag-candidate: C / foreign-tag-candidate: D / foreign-tag-candidate: AB |
| 5 | 12 | アルゴリズム | 計算量判断 | n個の要素を1回ずつ確認して最大値を求める処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n²) / foreign-tag-candidate: O(n log n) |
| 6 | 12 | アルゴリズム | 計算量判断 | 外側がn回、内側が常に10回の二重ループの計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n²) / foreign-tag-candidate: O(n log n) |
| 7 | 12 | データベース | 頻出SQL | 社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。 | foreign-tag-candidate: HAVING / foreign-tag-candidate: GROUP BY / foreign-tag-candidate: ORDER BY / foreign-tag-candidate: SELECT |
| 8 | 9 | アルゴリズム | トレース | n個の配列を先頭から最後まで1回ずつ調べる処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n log n) |
| 9 | 9 | アルゴリズム | トレース | n個の配列を二重ループですべての組合せに近い形で比較する処理の計算量はどれか。 | foreign-tag-candidate: O(1) / foreign-tag-candidate: O(log n) / foreign-tag-candidate: O(n log n) |
| 10 | 9 | アルゴリズム | 科目B長文アルゴリズム | 無向グラフに辺A-B、A-C、B-D、C-D、D-Eがある。Aから幅優先探索を行い、隣接頂点はアルファベット順に調べる。  頂点Eを訪問する直前に訪問される頂点はどれか。 | foreign-tag-candidate: A / foreign-tag-candidate: B / foreign-tag-candidate: C |
| 11 | 9 | データベース | SQL読解 | 注文表で注文IDだけでは商品を一意に識別できず、注文IDと商品IDの組で一意になる。このキーはどれか。 | foreign-tag-candidate: 主キー / foreign-tag-candidate: 外部キー / foreign-tag-candidate: 候補キー |
| 12 | 9 | データベース | 複合ケース | 商品ごとの売上合計が10万円以上の商品だけを表示したい。集計後の条件指定に使う句はどれか。 | foreign-tag-candidate: ORDER BY / foreign-tag-candidate: SELECT / foreign-tag-candidate: INSERT |
| 13 | 9 | マネジメント系 | 開発・運用 | リグレッションテストの目的はどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 14 | 9 | マネジメント系 | 開発・運用 | 負荷テストの目的はどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 15 | 9 | マネジメント系 | ケース問題 | 受入テストで主に確認することはどれか。 | foreign-tag-candidate: 成果物を人が確認して欠陥を早期発見する活動 / foreign-tag-candidate: 個々の部品や関数が正しく動くか確認するテスト / foreign-tag-candidate: 複数の部品を組み合わせた動作を確認するテスト |
| 16 | 8 | テクノロジ系 | 頻出計算 | 平均故障間隔を表す指標はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: RPO |
| 17 | 8 | テクノロジ系 | 頻出計算 | 平均修復時間を表す指標はどれか。 | foreign-tag-candidate: RTO / foreign-tag-candidate: RPO |
| 18 | 6 | アルゴリズム | 頻出処理 | 空のスタックに A, B, C の順にpushし、1回popしたとき取り出されるものはどれか。 | foreign-tag-candidate: B / foreign-tag-candidate: D |
| 19 | 6 | アルゴリズム | 頻出処理 | 空のキューに A, B, C の順にenqueueし、1回dequeueしたとき取り出されるものはどれか。 | foreign-tag-candidate: B / foreign-tag-candidate: D |
| 20 | 6 | アルゴリズム | データ構造応用 | ブラウザの戻る操作の履歴管理に最も適したデータ構造はどれか。 | foreign-tag-candidate: ヒープ / foreign-tag-candidate: 優先度付きキュー |
| 21 | 6 | アルゴリズム | データ構造応用 | 到着順に印刷要求を処理するために適したデータ構造はどれか。 | foreign-tag-candidate: ヒープ / foreign-tag-candidate: 優先度付きキュー |
| 22 | 6 | アルゴリズム | 科目B長文アルゴリズム | 次の処理でキューを操作する。キューは先入れ先出しである。  1. A、B、Cをこの順に追加する。 2. 先頭から1個取り出す。 3. Dを追加する。 4. 先頭から2個取り出す。  手順4で取り出される二つの値はどれか。 | foreign-tag-candidate: A、B / foreign-tag-candidate: C、B |
| 23 | 6 | アルゴリズム | サンプル発展・アルゴリズム | 配列の各要素の出現回数を効率よく数えるために適したデータ構造はどれか。 | foreign-tag-candidate: 二分木 / foreign-tag-candidate: 優先度付きキュー |
| 24 | 6 | データベース | ER図 | ER図でエンティティ間の関連を表すものはどれか。 | foreign-tag-candidate: 主キー / foreign-tag-candidate: 外部キー |
| 25 | 6 | データベース | SQL読解 | 部署名が部署IDに依存し、社員IDから部署IDが決まるとき、社員IDから部署名が間接的に決まる関係はどれか。 | foreign-tag-candidate: 第1正規形 / foreign-tag-candidate: 候補キー |
| 26 | 6 | マネジメント系 | 開発モデル | 要件定義から保守までを段階的に進める代表的な開発モデルはどれか。 | foreign-tag-candidate: アジャイル開発 / foreign-tag-candidate: DevOps |
| 27 | 6 | マネジメント系 | 品質管理 | テストで見つかった不具合の原因を分析し再発防止する活動はどれか。 | foreign-tag-candidate: 構成管理 / foreign-tag-candidate: 変更管理 |
| 28 | 6 | マネジメント系 | 見積り | プロジェクトの進捗を、計画価値・出来高・実コストで管理する手法はどれか。 | foreign-tag-candidate: ガントチャート / foreign-tag-candidate: WBS |
| 29 | 6 | マネジメント系 | 頻出管理 | 計画価値をPV、出来高をEV、実コストをACとして管理する手法はどれか。 | foreign-tag-candidate: ガントチャート / foreign-tag-candidate: WBS |
| 30 | 6 | マネジメント系 | ケース問題 | 障害を早く復旧した後、根本原因を分析して再発防止する活動はどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 構成管理 |
| 31 | 6 | マネジメント系 | ケース問題 | 本番環境への変更による障害リスクを抑えるため、事前に評価・承認する活動はどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 構成管理 |
| 32 | 6 | マネジメント系 | 複合ケース | サービス障害を復旧した後、同じ障害の再発防止を検討する活動はどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 構成管理 |
| 33 | 6 | マネジメント系 | 複合ケース | 設計変更を本番へ反映する前に、影響とリスクを評価して承認する活動はどれか。 | foreign-tag-candidate: インシデント管理 / foreign-tag-candidate: 構成管理 |
| 34 | 6 | マネジメント系 | サンプル発展・テスト | プログラム内部の分岐や命令を確認してテストケースを設計する方法はどれか。 | foreign-tag-candidate: 受入テスト / foreign-tag-candidate: レビュー |
| 35 | 6 | ストラテジ系 | 知的財産 | ソフトウェアのプログラムそのものを保護する代表的な権利はどれか。 | foreign-tag-candidate: 特許権 / foreign-tag-candidate: 商標権 |
| 36 | 6 | ストラテジ系 | マーケティング | プロダクトライフサイクルの説明として最も適切なものはどれか。 | foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 / foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 |
| 37 | 6 | ストラテジ系 | マーケティング | ロングテールの説明として最も適切なものはどれか。 | foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 / foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 |
| 38 | 6 | ストラテジ系 | 経営頻出 | ベンチマーキングの説明はどれか。 | foreign-tag-candidate: 市場成長率と市場占有率で事業を分類する手法 / foreign-tag-candidate: 顧客・競合・自社の三つの視点で分析する手法 |
| 39 | 6 | ストラテジ系 | 経営頻出 | コンプライアンスの説明はどれか。 | foreign-tag-candidate: 特定の個人を識別できる情報を適切に扱う考え方 / foreign-tag-candidate: 他人の認証情報を使った不正ログインなどを禁じる法律 |
| 40 | 6 | ストラテジ系 | 実戦ケース | 他社の登録商標を自社商品名として無断使用した場合に問題となる権利はどれか。 | foreign-tag-candidate: 著作権 / foreign-tag-candidate: 特許権 |
| 41 | 6 | テクノロジ系 | セキュリティ | TLSの説明として最も適切なものはどれか。 | foreign-tag-candidate: ドメイン名とIPアドレスを対応付ける仕組み / foreign-tag-candidate: 公衆網上に仮想的な専用通信路を作る技術 |
| 42 | 6 | テクノロジ系 | サンプル発展・ネットワーク | IPアドレスから対応するMACアドレスを求めるプロトコルはどれか。 | foreign-tag-candidate: DNS / foreign-tag-candidate: DHCP |
| 43 | 5 | アルゴリズム | 実戦トレース | 配列[1, 2, 3, 4, 5]から偶数だけを取り出すとどれか。 | foreign-tag-candidate: [4, 5] |
| 44 | 5 | アルゴリズム | サンプル発展・アルゴリズム | 深さ優先探索を反復処理で実装するとき、次に訪問する頂点の管理に適したデータ構造はどれか。 | foreign-tag-candidate: キャッシュメモリ |
| 45 | 5 | データベース | トランザクション | 「他処理の参照は許すが更新を制限するロック」に該当する用語はどれか。 | foreign-tag-candidate: デッドロック |
| 46 | 5 | データベース | 複合ケース | 在庫表を複数処理が同時更新し、後の更新で先の更新結果が失われた。この問題はどれか。 | foreign-tag-candidate: デッドロック |
| 47 | 3 | アルゴリズム | スタック | スタックのデータ取り出し方式を表すものはどれか。 | foreign-tag-candidate: FIFO |
| 48 | 3 | アルゴリズム | キュー | キューのデータ取り出し方式を表すものはどれか。 | foreign-tag-candidate: LIFO |
| 49 | 3 | アルゴリズム | 探索 | 二分探索の説明として最も適切なものはどれか。 | foreign-tag-candidate: 近い頂点から順に調べるグラフ探索 |
| 50 | 3 | アルゴリズム | 探索 | 線形探索の説明として最も適切なものはどれか。 | foreign-tag-candidate: 近い頂点から順に調べるグラフ探索 |
| 51 | 3 | アルゴリズム | データ構造 | 双方向リストの説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 52 | 3 | アルゴリズム | データ構造 | 木構造の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 53 | 3 | アルゴリズム | データ構造 | グラフの説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 54 | 3 | アルゴリズム | 擬似言語 | 代入の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 55 | 3 | アルゴリズム | 擬似言語 | 条件分岐の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 56 | 3 | アルゴリズム | 擬似言語 | 反復処理の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 57 | 3 | アルゴリズム | 擬似言語 | 配列の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 58 | 3 | アルゴリズム | 擬似言語 | 添字の説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 59 | 3 | アルゴリズム | 擬似言語 | トレースの説明として最も適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法 |
| 60 | 3 | アルゴリズム | 頻出処理 | 配列[3, 1, 4, 2]を昇順に整列した結果はどれか。 | foreign-tag-candidate: [4, 3, 2, 1] |
| 61 | 3 | アルゴリズム | 整列 | 選択ソートの説明として適切なものはどれか。 | foreign-tag-candidate: 先頭から順に目的の値を探す方法です。 |
| 62 | 3 | アルゴリズム | 擬似言語 | 「処理の中で自分自身を呼び出す考え方」に該当する用語はどれか。 | foreign-tag-candidate: スタック |
| 63 | 3 | アルゴリズム | 科目Bアルゴリズム | 配列[1, 2, 3, 4]を末尾から順に出力する。出力はどれか。 | foreign-tag-candidate: 1,2,3,4 |
| 64 | 3 | アルゴリズム | 科目Bアルゴリズム | スタックへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。 | foreign-tag-candidate: B、C |
| 65 | 3 | アルゴリズム | 科目Bアルゴリズム | キューへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。 | foreign-tag-candidate: B、C |
| 66 | 3 | アルゴリズム | 整列トレース | 配列[3, 1, 2]にバブルソートの1回目の走査を行う。走査後はどれか。 | foreign-tag-candidate: [3, 1, 2] |
| 67 | 3 | アルゴリズム | 条件分岐 | a=true、b=falseのとき、a AND NOT bの値はどれか。 | foreign-tag-candidate: false |
| 68 | 3 | アルゴリズム | フラグ処理 | found=falseで開始し、配列内に目標値を見つけたらfound=trueにして探索を終了する。目標値が存在しない場合のfoundはどれか。 | foreign-tag-candidate: true |
| 69 | 3 | アルゴリズム | 科目B長文アルゴリズム | 次の処理で、訪問済みでない頂点をキューへ追加する幅優先探索を行う。各頂点の隣接先はアルファベット順に調べる。  隣接関係: A-B、A-C、B-D、B-E、C-F 開始頂点: A  Aの次に訪問される二つの頂点はどれか。 | foreign-tag-candidate: C、B |
| 70 | 3 | アルゴリズム | 科目B長文アルゴリズム | 次の処理は、重複を除いて値を出力する。集合seenは初め空である。  values = [3, 1, 3, 2, 1] 各値について、seenに含まれていなければ出力してseenへ追加する。  出力される順序はどれか。 | foreign-tag-candidate: 1、2、3 |
| 71 | 3 | アルゴリズム | サンプル発展・アルゴリズム | 幅優先探索で、次に訪問する頂点を管理するために使うデータ構造はどれか。 | foreign-tag-candidate: ヒープ |
| 72 | 3 | データベース | 排他制御 | 複数の利用者が同じデータを同時更新して矛盾が起きるのを防ぐ仕組みはどれか。 | foreign-tag-candidate: ロールバック |
| 73 | 3 | データベース | 排他制御 | 共有ロックの説明として最も適切なものはどれか。 | foreign-tag-candidate: 未確定の更新を取り消す処理です。 |
| 74 | 3 | データベース | 排他制御 | 専有ロックの説明として最も適切なものはどれか。 | foreign-tag-candidate: 未確定の更新を取り消す処理です。 |
| 75 | 3 | データベース | 頻出SQL | トランザクションの途中で障害が起きた場合、更新を取り消す処理はどれか。 | foreign-tag-candidate: 共有ロック |
| 76 | 3 | データベース | DB頻出 | NULL値の説明として適切なものはどれか。 | foreign-tag-candidate: トランザクションの更新を確定する処理 |
| 77 | 3 | データベース | DB頻出 | NOT NULL制約の目的はどれか。 | foreign-tag-candidate: 他の表の主キーなどを参照して関連を表す項目 |
| 78 | 3 | データベース | DB頻出 | CHECK制約の目的はどれか。 | foreign-tag-candidate: 他の表の主キーなどを参照して関連を表す項目 |
| 79 | 3 | データベース | DB頻出 | インデックスの主な目的はどれか。 | foreign-tag-candidate: トランザクションの未確定更新を取り消す |
| 80 | 3 | データベース | SQL読解 | 更新途中のデータを他の処理が読まないようにする制御として適切なものはどれか。 | foreign-tag-candidate: ロールバック |
| 81 | 3 | データベース | SQL読解 | 誤って更新した直後、まだCOMMITしていない。更新を取り消す操作はどれか。 | foreign-tag-candidate: COMMIT |
| 82 | 3 | データベース | キー | 外部キーの説明として適切なものはどれか。 | foreign-tag-candidate: 列の値の重複を防ぐための制約です。 |
| 83 | 3 | データベース | キー | 候補キーの説明として適切なものはどれか。 | foreign-tag-candidate: 列の値の重複を防ぐための制約です。 |
| 84 | 3 | データベース | キー | 複合キーの説明として適切なものはどれか。 | foreign-tag-candidate: 列の値の重複を防ぐための制約です。 |
| 85 | 3 | データベース | 正規化 | 「繰返し項目をなくし値を原子的にした形」に該当する用語はどれか。 | foreign-tag-candidate: COMMIT |
| 86 | 3 | データベース | トランザクション | 「トランザクションの更新を確定する処理」に該当する用語はどれか。 | foreign-tag-candidate: SELECT |
| 87 | 3 | データベース | トランザクション | 「未確定の更新を取り消す処理」に該当する用語はどれか。 | foreign-tag-candidate: INSERT |
| 88 | 3 | データベース | サンプル発展・SQL | 関係データベースで、表から必要な列だけを取り出す関係演算はどれか。 | foreign-tag-candidate: 結合 |
| 89 | 3 | データベース | サンプル発展・SQL | 関係データベースで、条件に合う行だけを取り出す関係演算はどれか。 | foreign-tag-candidate: 結合 |
| 90 | 3 | マネジメント系 | 開発手法 | 短い期間で計画・実装・評価を繰り返す開発手法はどれか。 | foreign-tag-candidate: ウォータフォールモデル |
| 91 | 3 | マネジメント系 | 開発 | 単体テストの説明として最も適切なものはどれか。 | foreign-tag-candidate: 利用者要求を満たしているか確認するテスト |
| 92 | 3 | マネジメント系 | 開発 | 結合テストの説明として最も適切なものはどれか。 | foreign-tag-candidate: 利用者要求を満たしているか確認するテスト |
| 93 | 3 | マネジメント系 | 監査 | 監査証跡の説明として最も適切なものはどれか。 | foreign-tag-candidate: 変更を評価・承認してリスクを抑える活動です。 |
| 94 | 3 | マネジメント系 | 頻出管理 | WBSで分解した最下位の作業単位を何と呼ぶか。 | foreign-tag-candidate: クリティカルパス |
| 95 | 3 | ストラテジ系 | 経営戦略 | SWOT分析で、自社の内部環境に分類されるものはどれか。 | foreign-tag-candidate: 強みと機会 |
| 96 | 3 | ストラテジ系 | システム戦略 | 業務プロセスを抜本的に見直し再設計する考え方はどれか。 | foreign-tag-candidate: CRM |
| 97 | 3 | ストラテジ系 | システム企画 | 情報システム導入の投資効果を評価する指標として適切なものはどれか。 | foreign-tag-candidate: 損益分岐点 |
| 98 | 3 | ストラテジ系 | 頻出計算・法務 | 固定費が30万円、商品1個あたりの限界利益が300円のとき損益分岐点販売数量はどれか。 | foreign-tag-candidate: 3,000個 |
| 99 | 3 | ストラテジ系 | マーケティング | 「市場を顧客属性やニーズで細分化すること」に該当する用語はどれか。 | foreign-tag-candidate: CRM |
| 100 | 3 | ストラテジ系 | マーケティング | 「細分化した市場から狙う市場を選ぶこと」に該当する用語はどれか。 | foreign-tag-candidate: CRM |
| 101 | 3 | ストラテジ系 | マーケティング | 「顧客の中で自社製品の位置付けを明確にすること」に該当する用語はどれか。 | foreign-tag-candidate: CRM |
| 102 | 3 | ストラテジ系 | マーケティング | 「Product・Price・Place・Promotionの組合せ」に該当する用語はどれか。 | foreign-tag-candidate: CRM |
| 103 | 3 | ストラテジ系 | 複合ケース | 顧客データを分析して、既存顧客との関係強化と継続購入を狙う仕組みはどれか。 | foreign-tag-candidate: BPR |
| 104 | 3 | ストラテジ系 | サンプル発展・法務 | ソフトウェアを利用する権利を定める契約として最も適切なものはどれか。 | foreign-tag-candidate: 派遣契約 |
| 105 | 3 | テクノロジ系 | セキュリティ | 公開鍵暗号方式で、受信者だけが読めるように送信者が使う鍵はどれか。 | foreign-tag-candidate: 送信者の公開鍵 |
| 106 | 3 | テクノロジ系 | 頻出用語 | SSHについて正しい説明はどれか。 | foreign-tag-candidate: 端末へIPアドレスなどを自動配布する仕組み |
| 107 | 3 | テクノロジ系 | 頻出用語 | FTPについて正しい説明はどれか。 | foreign-tag-candidate: 端末へIPアドレスなどを自動配布する仕組み |
| 108 | 3 | テクノロジ系 | 頻出用語 | NTPについて正しい説明はどれか。 | foreign-tag-candidate: 端末へIPアドレスなどを自動配布する仕組み |
| 109 | 3 | テクノロジ系 | 頻出用語 | CIDRについて正しい説明はどれか。 | foreign-tag-candidate: 端末へIPアドレスなどを自動配布する仕組み |
| 110 | 3 | テクノロジ系 | 実戦問題 | 社外から社内システムへ安全に接続するために使う技術として適切なものはどれか。 | foreign-tag-candidate: WAF |
| 111 | 3 | テクノロジ系 | 暗号利用 | 電子署名付き文書を受信した。署名検証に使う鍵はどれか。 | foreign-tag-candidate: 受信者の公開鍵 |
| 112 | 3 | テクノロジ系 | サンプル発展・ハードウェア | データと分散パリティを複数ディスクへ配置し、1台の故障に耐えるRAID方式はどれか。 | foreign-tag-candidate: RAID1 |
| 113 | 3 | テクノロジ系 | サンプル発展・メモリ | 電源を切ると内容が失われ、リフレッシュ動作が必要な主記憶用メモリはどれか。 | foreign-tag-candidate: SSD |
