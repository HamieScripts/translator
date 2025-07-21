#!/usr/bin/env node
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as packageJson from '../package.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configFilePath = path.join(process.cwd(), 'polyflow.config.ts');

async function setupPolyFlow() {
  console.log(chalk.bold.cyan(`Welcome to PolyFlow CLI Setup! (v${packageJson.version})`));

  const translationRootDir = await askQuestion(chalk.yellow('Enter the root directory for your translations (e.g., src/assets/i18n): '));
  const defaultLanguage = await askQuestion(chalk.yellow('Enter the default language (defaults to en): ')) || 'en';
  const targetLanguagesInput = await askQuestion(chalk.yellow('Enter the languages you want to translate to (comma separated ISO codes, e.g., fr,es): '));
  const targetLanguages = targetLanguagesInput.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);

  const configContent = `export const polyflowConfig = {
  translationRootDir: '${translationRootDir}',
  defaultLanguage: '${defaultLanguage}',
  targetLanguages: [${targetLanguages.map(lang => `'${lang}'`).join(',')}]
};
`;

  fs.writeFileSync(configFilePath, configContent);
  console.log(chalk.green(`Configuration saved to ${configFilePath}`));

  rl.close();
}

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

setupPolyFlow();