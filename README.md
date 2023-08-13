# GPT-CLI
GPT CLI is a command-line interface tool that allows you to use ChatGPT power from your own CLI!
You can combine gpt-cli and other teraminal commands with standard input-output interface and make your work more efficient.

## 🔧 Installation

```bash
npm install -g @nullnull/gpt-cli
```

To run this CLI tool, you need to have [**Node.js version 16+ **](https://nodejs.org/en), recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage node version.

## 🚀 Features
```bash
# Just chatting
$ ai "Hello"
> Hello! How can I assist you today?

# Use pipe
$ echo "Hello" | ai "translate following English to Japanese"
> こんにちは

# Read file, convert content, and edit files in-place.
$ ai --file foo.ts --write "Remove all console.log()"

# execute command
$ ai command "list all .ts files in src folder"
# -----Command-----
# find src -name "*.ts"

# ----Explanation----
# findコマンドを使用すると、指定したディレクトリ下の全てのディレクトリ及びファイルを検索することができます。今回はsrcディレクトリを指定し、そこ下の全てのディレクトリとファイルを検索しています。
# -nameオプションで、ファイル名またはディレクトリ名に基づいて検索が可能で、引数はパターンを受け取ります。今回の場合、末尾が".ts"となる全ての名前のファイルを検索します。

# ? 🤖 Would you like to execute this command? (Use arrow keys)
# ❯ ✅ Run this command
#   🔁 Input further instructions
#   📋 Copy
#   ❌ Cancel
```

## 🛠️ Configuration
You can get your own API KEY from [OpenAI](https://platform.openai.com/account/api-keys/)

```sh
# Register your own API KEY
$ ai auth sk-xxxxxxxxxx

# Choose model
$ ai config
```

## 📜 License

GPT-CLI is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
