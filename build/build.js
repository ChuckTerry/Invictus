import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { mutate } from './mutate.js';

async function getTemplate() {
  const template = await readFile('./buildTemplate.js');
  return template.toString();
}


async function fillTemplate(mainString) {
  const nonDestructiveAssign = await readFile('../src/util/nonDestructiveAssign.js');
  mainString = mainString.replaceAll(/\{\{\{function_nonDestructiveAssign\}\}\}/g, nonDestructiveAssign.toString());

  const uuidGenerator = await readFile('../src/uuidGenerator.js');
  mainString = mainString.replace(/\{\{\{function_uuidGenerator\}\}\}/, uuidGenerator.toString());

  const navLinkInjector = await readFile('../src/navLinkInjector.js');
  mainString = mainString.replace(/\{\{\{function_navLinkInjector\}\}\}/, navLinkInjector.toString());

  const updateNotifier = await readFile('../src/updateNotifier.js');
  mainString = mainString.replace(/\{\{\{function_updateNotifier\}\}\}/, updateNotifier);

  const buildGlobalObject = await readFile('../src/buildGlobalObject.js');
  mainString = mainString.replace(/\{\{\{function_buildGlobalObject\}\}\}/, buildGlobalObject.toString());

  const FlashCard = await readFile('../src/FlashCard.js');
  mainString = mainString.replace(/\{\{\{class_FlashCard\}\}\}/, FlashCard.toString());

  const FlashCardSet = await readFile('../src/FlashCardSet.js');
  mainString = mainString.replace(/\{\{\{class_FlashCardSet\}\}\}/, FlashCardSet.toString());

  const styles = await readFile('../src/styles.css');
  mainString = mainString.replace(/\{\{\{css_styles\}\}\}/, styles.toString());

  mainString = mutate(mainString);

  const data = new Uint8Array(Buffer.from(mainString));
  const promise = writeFile('./TestBuild.txt', data);

  await promise;
  console.log('Build Operation Complete\r\nResult: %s\r\n[End of Result]', mainString);
}

getTemplate()
  .then((template) => fillTemplate(template));

const replaceArray = [
  ['../src/util/nonDestructiveAssign.js', /\{\{\{function_nonDestructiveAssign\}\}\}/],
  ['../src/uuidGenerator.js', /\{\{\{function_uuidGenerator\}\}\}/],
  ['../src/navLinkInjector.js', /\{\{\{function_navLinkInjector\}\}\}/],
  ['../src/updateNotifier.js', /\{\{\{function_updateNotifier\}\}\}/],
  ['../src/buildGlobalObject.js', /\{\{\{function_buildGlobalObject\}\}\}/],
  ['../src/FlashCard.js', /\{\{\{class_FlashCard\}\}\}/],
  ['../src/FlashCardSet.js', /\{\{\{class_FlashCardSet\}\}\}/],
  ['../src/styles.css', /\{\{\{css_styles\}\}\}/]
];























