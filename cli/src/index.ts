#!/usr/bin/env node
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as packageJson from '../../package.json';
import * as child_process from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configFilePath = path.join(process.cwd(), 'polyflow.config.ts');

// Supported ISO 639-1 language codes (a representative subset)
const supportedIsoCodes = new Set([
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru'
]);

async function setupPolyFlow() {
  console.log(chalk.bold.cyan(`Welcome to PolyFlow CLI Setup! (v${packageJson.version})`));

  const translationRootDir = await askQuestion(chalk.yellow('Enter the root directory for your translations (e.g., src/assets/i18n): '));

  let defaultLanguage: string;
  while (true) {
    const input = await askQuestion(chalk.yellow('Enter the default language (defaults to en): '));
    defaultLanguage = input.toLowerCase() || 'en';
    if (defaultLanguage.length === 2 && supportedIsoCodes.has(defaultLanguage)) {
      break;
    } else {
      console.log(chalk.red('Invalid default language. Please enter a 2-character ISO code (e.g., en, fr).'));
    }
  }

  let targetLanguages: string[];
  while (true) {
    const input = await askQuestion(chalk.yellow('Enter the languages you want to translate to (comma separated ISO codes, e.g., fr,es): '));
    const rawLanguages = input.split(',').map(lang => lang.trim().toLowerCase()).filter(lang => lang.length > 0);
    const invalidLanguages = rawLanguages.filter(lang => lang.length !== 2 || !supportedIsoCodes.has(lang));

    if (invalidLanguages.length === 0) {
      targetLanguages = rawLanguages;
      break;
    } else {
      console.log(chalk.red(`Invalid target language(s): ${invalidLanguages.join(', ')}. Please enter 2-character ISO codes (e.g., fr, es).`));
    }
  }

  const configContent = `export const polyflowConfig = {
  translationRootDir: '${translationRootDir}',
  defaultLanguage: '${defaultLanguage}',
  targetLanguages: [${targetLanguages.map(lang => `'${lang}'`).join(',')}]
};
`;

  fs.writeFileSync(configFilePath, configContent);
  console.log(chalk.green(`Configuration saved to ${configFilePath}`));

  // Check and create language files
  const allLanguages = [defaultLanguage, ...targetLanguages];
  for (const lang of allLanguages) {
    const langFilePath = path.join(translationRootDir, `${lang}.json`);
    if (!fs.existsSync(langFilePath)) {
      fs.mkdirSync(path.dirname(langFilePath), { recursive: true }); // Ensure directory exists
      fs.writeFileSync(langFilePath, '{}');
      console.log(chalk.blue(`Created empty language file: ${langFilePath}`));
    } else {
      console.log(chalk.gray(`Language file already exists: ${langFilePath}`));
    }
  }

  console.log(chalk.cyan('Installing poly-flow-service Angular library...'));
  try {
    const npmPath = process.env.npm_execpath || 'npm';
    const npmArgs = [npmPath, 'install', 'poly-flow-service'];
    await new Promise<void>((resolve, reject) => {
      const installProcess = child_process.spawn(process.execPath, npmArgs, { stdio: 'inherit' });
      installProcess.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`npm install poly-flow-service failed with code ${code}`));
        }
      });
    });
    console.log(chalk.green('poly-flow-service installed successfully!'));
  } catch (error: any) {
    console.error(chalk.red(`Failed to install poly-flow-service: ${error.message}`));
  }

  rl.close();
}

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

setupPolyFlow();