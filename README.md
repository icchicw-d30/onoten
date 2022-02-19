# revDartSass-ejs-gulp-sp
- これは静的サイト用DartSass対応のGulpファイルです
- src内のejsファイルからhtmlファイルにコンパイルされます

# 手順
- ダウンロード後、ターミナルを起動する
- npm i を実行する（基本1度だけで良いです）
- npx gulp で実行する
- ファイルを修正し保存したらdistフォルダが生成され、そのなかのindex.htmlがブラウザへ反映されます

# 注意点
- 開発するフォルダはsrcになります。
- gulp起動時にはdistフォルダの中身が一度整理されます。（distに直接書き込むと後々、消えます）
- srcフォルダで追加したものはdistフォルダに吐き出されます。

## Nodeについて
- node v14系とv16系で動作を確認済み。
- 推奨はv16.13.0です（2021/11/27現在）。推奨版は以下を確認。
- https://nodejs.org/ja/
- nodenvをインストールし、ローカルとグローバルでNodeバージョンを設定すれば、自動で切り替え出来るので便利です。
- https://zenn.dev/donchan922/articles/b08a66cf3cbbc5
- https://qiita.com/mame_daifuku/items/1dbdfbd4897b34df0d9f
- nodenvに切り替え後、npm i や npx gulpでエラーが発生する場合はnodebrewやnodenvを一旦アンインストール・$PATH削除し、再インストールをお勧めします。

## Sass
- 基本的に名前空間と階層の指定は省略できるように設定してあります
- FLOCCS記法を想定しているためobjectフォルダ内にcomponent, layout, projectフォルダがあります。_dummy.scssがあるので、コピペしてからお使いください。必要な記述が既に書いてあります
- globalフォルダには変数・各種設定関係が格納されています。
- globalフォルダに格納されている変数を使用する際は、@use 'global' as *;の記述が必要です
- foundationフォルダのreset.scssに「リキッドレイアウト対応」の記述があります。

## JSの記述
- src内のjsフォルダ内で直書きする

## 画像
- src内のimgフォルダ内で直書きする
- 読み込む際は必ずsrcから。
- 必要に応じてフォルダを作成してその中にいれる
- 自動圧縮されます

## その他
- npx gulp実行時のcssフォルダ消去タスクは停止中（エラーが出るため）
# onoten
