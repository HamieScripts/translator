const core = require('@actions/core');
const https = require('https');

function fetchJson(uri) {
  return new Promise((resolve, reject) => {
    https.get(uri, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(new Error('Failed to parse JSON from URI.'));
        }
      });
    }).on('error', reject);
  });
}

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
    const fromUri = core.getInput('from');
    const to = core.getInput('to');

    if (!/^[a-z]{2}$/.test(to)) {
      throw new Error('Invalid "to" language code. Use 2-letter ISO codes only.');
    }

    core.info(`Fetching source JSON from: ${fromUri}`);
    const sourceJson = await fetchJson(fromUri);

    const translatedJson = dummyTranslateJson(sourceJson, to);
    const output = JSON.stringify(translatedJson);

    core.setOutput('translated', output);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();