export type GptCliFixedPrompt = {
  chatWithStdin: string
  chatWithFile: string
  commandWithExplanation: string
  commandWithoutExplanation: string
  commandWithNoInteraction: string
  replace: string
}

// TODO
const englishPrompt: GptCliFixedPrompt = {
  chatWithStdin: `次に送るテキスト文字列について、以下の指示を実行してください。{{#minimal}}指示に含まれる返答以外は絶対にしないでください。余計な解説は不要です。{{/minimal}}
指示：{{prompt}}`,
  chatWithFile: `次に送るファイルの中身について、以下の指示を実行してください。{{#minimal}}指示に含まれる返答以外は絶対にしないでください。余計な解説は不要です。{{/minimal}}
ファイル名：{{filePath}}
指示：{{prompt}}`,
  commandWithExplanation: `これから行う指示に合わせて、コマンド生成してください。また、コマンドの解説文を生成してください。

# 出力形式
1行目にコマンドを、改行を2つ以上あけてから解説文を記述してください。
今後の全ての指示において、絶対にこの形式で返事をしてください。例外はありません。

# 例
## 指示の例
jsファイルを一覧表示してください。
## 出力例
find . -name *.js

findコマンドは、UNIXおよびLinuxシステムにおいて、指定したディレクトリからファイルやディレクトリを検索するためのコマンドです。
様々なオプションと組み合わせて、ファイル名、ファイルタイプ、ファイルサイズ、更新日などの基準で検索が可能です。
-nameオプションは、ファイル名やディレクトリ名に基づいて検索を行うためのオプションです。

# 実行環境
OS: {{ platform }}

次に指示を送ります。`,
  commandWithoutExplanation: `これから行う指示に合わせて、コマンド生成してください。
コマンドのみを出力してください。余計な解説や文章は絶対に含めないでください。
今後の全ての指示において、絶対にこの形式で返事をしてください。例外はありません。

# 例
## 指示の例
jsファイルを一覧表示してください。
## 出力例
find . -name *.js

# 実行環境
OS: {{platform}}

次に指示を送ります。`,
  commandWithNoInteraction: `これから行う指示に合わせて、コマンドを生成してください。
コマンド以外を返事に含めないでください。
OS: {{platform}}`,
  replace: `テキストファイルの中身をこれから行う指示に合わせて書き換えてください。
最初に指示を送り、次にファイルの中身を送ります。
出力は書き換えたファイルの中身のみです。それ以外の文字列を含めないでください。
ファイル名：{{filePath}}
`,
}

const japanesePrompt: GptCliFixedPrompt = {
  chatWithStdin: `次に送るテキスト文字列について、以下の指示を実行してください。{{#minimal}}指示に含まれる返答以外は絶対にしないでください。余計な解説は不要です。{{/minimal}}
指示：{{prompt}}`,
  chatWithFile: `次に送るファイルの中身について、以下の指示を実行してください。{{#minimal}}指示に含まれる返答以外は絶対にしないでください。余計な解説は不要です。{{/minimal}}
ファイル名：{{filePath}}
指示：{{prompt}}`,
  commandWithExplanation: `これから行う指示に合わせて、コマンド生成してください。また、コマンドの解説文を生成してください。

# 出力形式
1行目にコマンドを、改行を2つ以上あけてから解説文を記述してください。
今後の全ての指示において、絶対にこの形式で返事をしてください。例外はありません。

# 例
## 指示の例
jsファイルを一覧表示してください。
## 出力例
find . -name *.js

findコマンドは、UNIXおよびLinuxシステムにおいて、指定したディレクトリからファイルやディレクトリを検索するためのコマンドです。
様々なオプションと組み合わせて、ファイル名、ファイルタイプ、ファイルサイズ、更新日などの基準で検索が可能です。
-nameオプションは、ファイル名やディレクトリ名に基づいて検索を行うためのオプションです。

# 実行環境
OS: {{ platform }}

次に指示を送ります。`,
  commandWithoutExplanation: `これから行う指示に合わせて、コマンド生成してください。
コマンドのみを出力してください。余計な解説や文章は絶対に含めないでください。
今後の全ての指示において、絶対にこの形式で返事をしてください。例外はありません。

# 例
## 指示の例
jsファイルを一覧表示してください。
## 出力例
find . -name *.js

# 実行環境
OS: {{platform}}

次に指示を送ります。`,
  commandWithNoInteraction: `これから行う指示に合わせて、コマンドを生成してください。
コマンド以外を返事に含めないでください。
OS: {{platform}}`,
  replace: `テキストファイルの中身をこれから行う指示に合わせて書き換えてください。
最初に指示を送り、次にファイルの中身を送ります。
出力は書き換えたファイルの中身のみです。それ以外の文字列を含めないでください。
ファイル名：{{filePath}}
`,
}

export const fixedPrompt = {
  ja: japanesePrompt,
  en: englishPrompt,
}
