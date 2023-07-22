/**
 * Uses a simple cipher to convert a string or number to a string of letters (a-j of A-J)
 * @param {string | number} numberOrString the string or number to be converted
 * @param {boolean} preserveNonNumeric if false (default), non-numeric characters will be removed
 * @param {boolean} lowercase if true (default), the output will be lowercase
 * @returns 
 */
function cipher_Numeric2Alpha(numberOrString, preserveNonNumeric = false, lowercase = true) {
  // Set up the character cipher lookup array based on lowercase flag
  const characterCipher = lowercase
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const characterArray = [...numberOrString.toString()];
  return characterArray.reduce((accumulator, character) => {
    return accumulator + (characterCipher[character] || (preserveNonNumeric ? character : ''));
  }, '');
}

/**
 * Generates a unique identifier based on current time and a random number
 * @returns {string} A unique identifier
 */
function makeUuid() {
  // Epoch formatted Date with last three digits (milliseconds) stripped
  const epoch = Date.now().toString().slice(0, 10);
  // Random 10 digit number with leading zero and decimal point stripped
  const random = Math.random().toString().slice(2, 12);
  return 'uuid-' + cipher_Numeric2Alpha(`${random}-${epoch}`, true);
}

