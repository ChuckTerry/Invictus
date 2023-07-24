/**
 * Removes all native console output from a string.
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripConsoleOutput(string) {
  const regex = /console\.(?:debug|error|info|log|warn)\(.*\);*/g;
  return string.replaceAll(regex, '');
}
