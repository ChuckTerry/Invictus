function cipher_Numeric2Alpha(numberOrString, preserveNonNumeric = false, lowercase = true) {
  const characterCipher = lowercase
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  return [...numberOrString.toString()].reduce((accumulator, character) => {
    return accumulator + (characterCipher[character] || (preserveNonNumeric ? character : ''));
  }, '');
}

function makeUuid() {
  const epoch = Date.now();
  const random = Math.random().toString().slice(2, 12)
  return 'uuid-' + epoch + '-' + cipher_Numeric2Alpha(random).toLowerCase();
}

