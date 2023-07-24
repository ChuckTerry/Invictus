/**
 * Strips import statements from a string.
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripImportStatements(string) {
  const lineArray = string.split('\n');
  const lineCount = lineArray.length;
  for (let index = 0; index < lineCount; index++) {
    const line = lineArray[index];
    if (line.trim().startsWith('import')) {
      lineArray[index] = '';
    }
  }
  return lineArray.join('\n');
}
