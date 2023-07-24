/**
 * Strips all export keywords from a string.
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripExportKeywords(string) {
  const lineArray = string.split('\n');
  const lineCount = lineArray.length;
  for (let index = 0; index < lineCount; index++) {
    const line = lineArray[index];
    if (line.trim().startsWith('export ')) {
      lineArray[index] = line.replace('export ', '');
    }
  }
  return lineArray.join('\n');
}
