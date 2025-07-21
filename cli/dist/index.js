#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const packageJson = __importStar(require("../../package.json"));
const child_process = __importStar(require("child_process"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const configFilePath = path.join(process.cwd(), 'polyflow.config.ts');
// Supported ISO 639-1 language codes (a representative subset)
const supportedIsoCodes = new Set([
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru'
]);
function setupPolyFlow() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.bold.cyan(`Welcome to PolyFlow CLI Setup! (v${packageJson.version})`));
        const translationRootDir = yield askQuestion(chalk_1.default.yellow('Enter the root directory for your translations (e.g., src/assets/i18n): '));
        let defaultLanguage;
        while (true) {
            const input = yield askQuestion(chalk_1.default.yellow('Enter the default language (defaults to en): '));
            defaultLanguage = input.toLowerCase() || 'en';
            if (defaultLanguage.length === 2 && supportedIsoCodes.has(defaultLanguage)) {
                break;
            }
            else {
                console.log(chalk_1.default.red('Invalid default language. Please enter a 2-character ISO code (e.g., en, fr).'));
            }
        }
        let targetLanguages;
        while (true) {
            const input = yield askQuestion(chalk_1.default.yellow('Enter the languages you want to translate to (comma separated ISO codes, e.g., fr,es): '));
            const rawLanguages = input.split(',').map(lang => lang.trim().toLowerCase()).filter(lang => lang.length > 0);
            const invalidLanguages = rawLanguages.filter(lang => lang.length !== 2 || !supportedIsoCodes.has(lang));
            if (invalidLanguages.length === 0) {
                targetLanguages = rawLanguages;
                break;
            }
            else {
                console.log(chalk_1.default.red(`Invalid target language(s): ${invalidLanguages.join(', ')}. Please enter 2-character ISO codes (e.g., fr, es).`));
            }
        }
        const configContent = `export const polyflowConfig = {
  translationRootDir: '${translationRootDir}',
  defaultLanguage: '${defaultLanguage}',
  targetLanguages: [${targetLanguages.map(lang => `'${lang}'`).join(',')}]
};
`;
        fs.writeFileSync(configFilePath, configContent);
        console.log(chalk_1.default.green(`Configuration saved to ${configFilePath}`));
        // Check and create language files
        const allLanguages = [defaultLanguage, ...targetLanguages];
        for (const lang of allLanguages) {
            const langFilePath = path.join(translationRootDir, `${lang}.json`);
            if (!fs.existsSync(langFilePath)) {
                fs.mkdirSync(path.dirname(langFilePath), { recursive: true }); // Ensure directory exists
                fs.writeFileSync(langFilePath, '{}');
                console.log(chalk_1.default.blue(`Created empty language file: ${langFilePath}`));
            }
            else {
                console.log(chalk_1.default.gray(`Language file already exists: ${langFilePath}`));
            }
        }
        console.log(chalk_1.default.cyan('Installing poly-flow-service Angular library...'));
        try {
            const npmPath = process.env.npm_execpath || 'npm';
            const npmArgs = [npmPath, 'install', 'poly-flow-service'];
            yield new Promise((resolve, reject) => {
                const installProcess = child_process.spawn(process.execPath, npmArgs, { stdio: 'inherit' });
                installProcess.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`npm install poly-flow-service failed with code ${code}`));
                    }
                });
            });
            console.log(chalk_1.default.green('poly-flow-service installed successfully!'));
        }
        catch (error) {
            console.error(chalk_1.default.red(`Failed to install poly-flow-service: ${error.message}`));
        }
        rl.close();
    });
}
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
setupPolyFlow();
