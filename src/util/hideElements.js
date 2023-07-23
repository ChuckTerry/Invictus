export function hideElements(...elements) {
  const elementCount = elements.length;
  for (let index = 0; index < elementCount; index++) {
    elements[index].classList.add('hidden');
  }
  return elements.length === 1 ? elements[0] : elements;
}
