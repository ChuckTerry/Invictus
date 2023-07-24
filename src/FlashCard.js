export class FlashCard {

  static from(term, definition) {
    return new FlashCard({
      Term: {
        Content: term
      },
      Definition: {
        Content: definition
      },
      Created: Date.now(),
      Modified: Date.now()
    });
  }

  constructor(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    this.term = json.Term.Content;
    this.definition = json.Definition.Content;
    this.created = json.Created;
    this.modified = json.Modified;
    this.element = this.generateHtml();
  }

  generateHtml() {
    const element = document.createElement('div');
    element.classList.add('invictus', 'card-wrapper');
    const innerElement = document.createElement('div');
    element.appendChild(innerElement);
    innerElement.outerHTML = '<div class="invictus card-inner"><div class="invictus card-front"><div class="invictus card-term"><p class="invictus term-text"></p></div></div><div class="invictus card-back"><div class="invictus card-definition"><p class="invictus definition-text"></p></div></div></div>';
    element.querySelector('.term-text').innerText = this.term;
    element.querySelector('.definition-text').innerText = this.definition;
    innerElement.addEventListener('click', this.flip);
    return element;
  }

  hide() {
    this.element.classList.remove('active');
    this.element.classList.remove('selected');
    this.activeCard.classList.add('hidden');
    return this.element;
  }

  show() {
    this.element.classList.add('active');
    this.activeCard.classList.remove('hidden');
    return this.element;
  }

  flip(eventOrHtmlElement) {
    const cardElement = eventOrHtmlElement instanceof HTMLElement ? eventOrHtmlElement : eventOrHtmlElement.currentTarget;
    cardElement.parentElement.classList.toggle('selected');
  }

}
