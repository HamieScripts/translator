const core = require('@actions/core');



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
  try {

    const sourceJsonBase64 = core.getInput('source-json');
    const sourceJsonStr = Buffer.from(sourceJsonBase64, 'base64').toString('utf8');
    const to = core.getInput('to');

    if (!/^[a-z]{2}$/.test(to)) {
      throw new Error('Invalid "to" language code. Use 2-letter ISO codes only.');
    }

    if (!sourceJsonStr) {
      throw new Error('source-json input is missing.');
    }

    const sourceJson = JSON.parse(sourceJsonStr);

    const translatedJson = dummyTranslateJson(sourceJson, to);
    const output = JSON.stringify(translatedJson);

    core.setOutput('translated', output);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();