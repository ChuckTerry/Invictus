import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { mutate } from './mutate.js';
import { getBuildNumber } from './util/getVersionInfo.js';

async function getTemplate() {
  const template = await readFile('./templates/buildTemplate.js');
  return template.toString();
}

async function buildHtml(string) {
  let html = await readFile('./templates/buildTemplate.html');
  html = html.toString().replace(/\{\{\{LOADER\}\}\}/, string.toString());
  const data = new Uint8Array(Buffer.from(html));
  const promise = await writeFile('./TestBuild.html', data);
  console.log('HTML Build Operation Complete\r\nResult: %s\r\n[End of Result]', html);
  return html;
}

async function mutateResult(string) {
  return mutate(string);
}

async function fillTemplate(string, contentFilePath, regexMatch) {
  const fillContents = await readFile(contentFilePath);
  return string.replaceAll(regexMatch, fillContents.toString());
}

async function buildJavascript(string, buildArray) {
  const fileCount = buildArray.length;
  for (let index = 0; index < fileCount; index++) {
    const [path, regex] = buildArray[index];
    string = await fillTemplate(string, path, regex);
  }
  return string;
}

async function bumpBuildNumber() {
  const fillContents = await readFile('./util/BUILD');
  const build = parseInt(fillContents.toString(), 10) + 1;
  const buildData = new Uint8Array(Buffer.from(build.toString()));
  await writeFile('./util/BUILD', buildData);
  const fullBuildNumber = getBuildNumber();
  const data = new Uint8Array(Buffer.from(fullBuildNumber));
  await writeFile('./BUILD_NUMBER', data);
  return;
}

const replaceArray = [
  ['../src/util/nonDestructiveAssign.js', /\{\{\{function_nonDestructiveAssign\}\}\}/g],
  ['../src/uuidGenerator.js', /\{\{\{function_uuidGenerator\}\}\}/g],
  ['../src/navLinkInjector.js', /\{\{\{function_navLinkInjector\}\}\}/g],
  ['../src/updateNotifier.js', /\{\{\{function_updateNotifier\}\}\}/g],
  ['../src/buildGlobalObject.js', /\{\{\{function_buildGlobalObject\}\}\}/g],
  ['../src/FlashCard.js', /\{\{\{class_FlashCard\}\}\}/g],
  ['../src/FlashCardSet.js', /\{\{\{class_FlashCardSet\}\}\}/g],
  ['../src/styles.css', /\{\{\{css_styles\}\}\}/g],
  ['./BUILD_NUMBER', /\{\{\{id_buildNumber\}\}\}/g]
];

bumpBuildNumber()
  .then(() => getTemplate())
  .then((javaScriptTemplate) => buildJavascript(javaScriptTemplate, replaceArray))
  .then((parsedTemplate) => mutateResult(parsedTemplate))
  .then((mutatedResult) => buildHtml(mutatedResult));
