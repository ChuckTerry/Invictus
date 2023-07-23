export function unhideElements(...elements) {
  const elementCount = elements.length;
  for (let index = 0; index < elementCount; index++) {
    elements[index].classList.remove('hidden');
  }
  return elements.length === 1 ? elements[0] : elements;
}
