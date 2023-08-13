export type GptCliFixedPrompt = {
  chatWithStdin: string
  chatWithFile: string
  commandWithExplanation: string
  commandWithoutExplanation: string
  commandWithNoInteraction: string
  replace: string
}

const englishPrompt: GptCliFixedPrompt = {
  chatWithStdin: `Please execute the following instruction for the next text string to be sent. 
{{#minimal}}Stick strictly to the response required in the instruction. No extra explanations are needed.{{/minimal}}
Instruction: {{prompt}}
`,
  chatWithFile: `Please execute the following instruction for the next text string to be sent. 
{{#minimal}}Stick strictly to the response required in the instruction. No extra explanations are needed.{{/minimal}}
File Path: {{filePath}}
Instruction: {{prompt}}`,
  commandWithExplanation: `Please generate commands according to the instructions provided, and also create an explanatory text for the command.

# Output Format
Write the command on the first line, then leave at least two line breaks before writing the explanatory text.
Make sure to follow this format for all future responses without exception.

# Example
## Instruction Example
List all js files.
## Output Example
find . -name *.js

The find command is used in UNIX and Linux systems to search for files or directories in the specified directory. 
It can be combined with various options to search by criteria such as filename, file type, file size, and modification date. 
The -name option is used to search based on filenames or directory names.

# Execution Environment
OS: {{ platform }}

The next instruction will follow.
`,
  commandWithoutExplanation: `Please generate commands according to the instructions that will be provided.
Output the command only. Do not include any extra explanations or text.
Make sure to follow this format for all future responses without exception.

# Example
## Instruction Example
List all js files.
## Output Example
find . -name *.js

# Execution Environment
OS: {{platform}}

The next instruction will follow.`,
  commandWithNoInteraction: `Please generate a command according to the instruction that will be provided.
Do not include anything other than the command in your response.
OS: {{platform}}`,
  replace: `Please rewrite the contents of the text file according to the instructions that will be provided.
I will first send the instructions, followed by the contents of the file.
The output should only consist of the rewritten contents of the file. Do not include any other text.
File name: {{filePath}}`,
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
