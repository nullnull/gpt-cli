import chalk from 'chalk'

export function foo() {
  console.log(chalk.red('foo'), process.env.NODE_ENV)
}
