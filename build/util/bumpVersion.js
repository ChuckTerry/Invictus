import { readFileSync, writeFileSync } from 'node:fs';

function bump(index) {
  const currentVersion = readFileSync('../VERSION').toString();
  const versionArray = currentVersion.split('.');
  versionArray[index] = (parseInt(versionArray[index], 10) + 1).toString();
  const newVersion = versionArray.join('.');
  writeFileSync('../VERSION', newVersion);
  return newVersion;

}

export function bumpPatch() {
  return bump(2);
}

export function bumpMinor() {
  return bump(1);
}

export function bumpMajor() {
  return bump(0);
}


