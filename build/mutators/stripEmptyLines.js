/**
 * Strips emty lines from a string
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripEmptyLines(string) {
  const lineArray = string.split('\n');
  const returnArray = [];
  const lineCount = lineArray.length;
  for (let index = 0; index < lineCount; index++) {
    const line = lineArray[index];
    if (line.trim() !== '') returnArray.push(line);
  }
  return returnArray.join('\n');
}
