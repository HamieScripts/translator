const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

function dummyTranslateJson(obj, toLang) {
  if (typeof obj === 'string') {
    return `[${toLang}] ${obj}`;
  } else if (typeof obj === 'object' && obj !== null) {
    const result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      result[key] = dummyTranslateJson(obj[key], toLang);
    }
    return result;
  }
  return obj;
}

async function run() {
  console.log(process.cwd())
  try {
    const folder = core.getInput('folder');
    const from = core.getInput('from');
    const to = core.getInput('to');

    if (!/^[a-z]{2}$/.test(from) || !/^[a-z]{2}$/.test(to)) {
      throw new Error('Invalid language code. Use 2-letter ISO codes only.');
    }

    const fromFilePath = path.join(process.cwd(), folder, `${from}.json`);
    core.info(`Reading source JSON: ${fromFilePath}`);

    if (!fs.existsSync(fromFilePath)) {
      throw new Error(`Source file not found: ${fromFilePath}`);
    }

    const fileContent = fs.readFileSync(fromFilePath, 'utf-8');
    const sourceJson = JSON.parse(fileContent);

    const translatedJson = dummyTranslateJson(sourceJson, to);
    const output = JSON.stringify(translatedJson);

    core.setOutput('translated', output);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();