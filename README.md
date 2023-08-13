# GPT-CLI
GPT-CLI is a command-line interface tool that allows you to use ChatGPT power from your own CLI!

You can combine GPT-CLI and other teraminal commands with standard input-output interface and make your work more efficient.

## 🔧 Installation

```bash
npm install -g @nullnull/gpt-cli
```

To run this CLI tool, you need to have **[Node.js version 16+ ](https://nodejs.org/en)**, recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage node version.

## 🚀 Features
- Well-suited with the UNIX programming style, such as standard output and piping
- Easy to install and use
- Japanese Support. プロファイルを切り替えることで、出力を日本語にできます。

## 👀 How to Use
```bash
# Just chatting
$ ai "Hello"
Hello! How can I assist you today?

# Piping
$ echo "Hello" | ai "translate following English to Japanese"
こんにちは

# Read file, convert content, and edit files in-place.
$ ai --file foo.ts --write "Remove all console.log()"

# Execute command
$ ai command "execute following command to all *.ts files in src folder.
ai --file foo.ts --write 'Remove all console.log()'"

-----Command-----
find ./src -name "*.ts" -exec ai --file {} --write 'Remove all console.log()' \;

----Explanation----
The command uses the `find` command, which allows us to look for files in a directory. In this specific case, we're looking for all files in the 'src' directory having the '.ts' extension.
For each file found, the `-exec` option allows us to execute another command ('ai' in this case), and the `{}` placeholder is substituted with the current file found. The ai command will then perform the removal of all 'console.log()' instances in every file, requested by the `--write 'Remove all console.log()'` argument.
The `\;` at the end of the command signals the end of the `-exec` command.

? 🤖 Would you like to execute this command? (Use arrow keys)
❯ ✅ Run this command
  🔁 Input further instructions
  📋 Copy
  ❌ Cancel
```

## 🛠️ Configuration
You can get your own API KEY from [OpenAI](https://platform.openai.com/account/api-keys/)

```sh
# Register your own API KEY
$ ai auth sk-xxxxxxxxxx

# Choose model, language for prompt
$ ai config
```

## 📜 License

GPT-CLI is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
