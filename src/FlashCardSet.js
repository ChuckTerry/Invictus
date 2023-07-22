import { FlashCard } from './FlashCard.js';

/**
 * Handles the creation and management of a set of Flash Cards
 */
class FlashCardSet {
  /**
   * Class Constructor
   * @param {object | string} json The JSON data for the Flash Card Set
   */
  constructor(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    this.json = json;
    this.uuid = json.UUID;
    this.element = document.querySelector('#' + this.uuid);
    if (this.element === null) {
      throw new ReferenceError('Unable to locate destination element (UUID: "' + this.uuid + '") on current page');
    }
    this.title = json.Title;
    this.created = json.Created;
    this.modified = json.Modified;
    this.cardSet = [];
    this.outerWrapper = null;
    this.showButton = null;
    this.closeButton = null;
    this.shuffleButton = null;
    this.nextCardButton = null;
    this.previousCardButton = null;
    this.cardArea = null;
    this.cardAreaWrapper = null;
    this.activeCard = null;
    this.activeCardSetIndex = 0;

    const cardCount = json.FlashCards.length;
    for (let index = 0; index < cardCount; index++) {
      const cardData = json.FlashCards[index];
      const card = new FlashCard(cardData);
      this.cardSet.push(card);
    }
    invictus.flashCards.sets.push(this);

    this.invictusBlock = this.makeInvictusBlock();
    this.element.appendChild(this.invictusBlock);
    this.shuffleAndPlaceCards();
    this.cardSet[0].element.classList.add('active');
    this.activeCard = this.cardSet[0];
    this.element.classList.remove('placeholder');
    this.element.parentElement.classList.remove('no-overflow');
    this.makeControlsReactive();
  }

  makeControlsReactive() {
    /* Show Button Click Event */
    this.showButton.addEventListener('click', () => {
      this.showButton.classList.add('hidden');
      this.closeButton.classList.remove('hidden');
      this.shuffleButton.classList.remove('hidden');
      this.cardAreaWrapper.classList.remove('hidden');
      this.outerWrapper.classList.add('expanded');
    });

    /* Close Button Click Event */
    this.closeButton.addEventListener('click', () => {
      this.closeButton.classList.add('hidden');
      this.shuffleButton.classList.add('hidden');
      this.showButton.classList.remove('hidden');
      this.cardAreaWrapper.classList.add('hidden');
      this.outerWrapper.classList.remove('expanded');
    });

    /* Shuffle Button Click Event */
    this.shuffleButton.addEventListener('click', () => {
      this.shuffle();
    });

    /* Previous Card Button Click Event */
    this.previousCardButton.addEventListener('click', () => {
      this.activeCard.classList.toggle('active');
      this.activeCard.classList.remove('selected');
      this.activeCardSetIndex = this.activeCardSetIndex === 0 ? this.cardSet.length - 1 : this.activeCardSetIndex - 1;
      this.activeCard = this.cardSet[this.activeCardSetIndex];
      this.activeCard.classList.toggle('hidden');
      this.activeCard.classList.toggle('active');
    });

    /* Next Card Button Click Event */
    this.nextCardButton.addEventListener('click', () => {
      this.activeCard.classList.toggle('active');
      this.activeCard.classList.remove('selected');
      this.activeCardSetIndex = this.activeCardSetIndex === this.cardSet.length - 1 ? 0 : this.activeCardSetIndex + 1;
      this.activeCard = this.cardSet[this.activeCardSetIndex];
      this.activeCard.classList.toggle('hidden');
      this.activeCard.classList.toggle('active');
    });
  }

  makeInvictusElement(classNames, type = 'div', childrenArray = [], innerText) {
    const element = document.createElement(type);
    element.classList.add('invictus');
    if (typeof classNames === 'string') {
      classNames = classNames.includes(' ') ? classNames.split(' ') : [classNames];
    }
    if (Array.isArray(classNames)) {
      const classNameCount = classNames.length;
      for (let index = 0; index < classNameCount; index++) {
        element.classList.add(classNames[index]);
      }
    }
    if (childrenArray instanceof HTMLElement) {
      childrenArray = [childrenArray];
    }
    if (Array.isArray(childrenArray)) {
      const childCount = childrenArray.length;
      for (let index = 0; index < childCount; index++) {
        element.appendChild(childrenArray[index]);
      }
    }
    if (type === 'button') {
      element.type = 'button';
    }
    if (innerText) {
      element.innerText = innerText;
    }
    return element;
  }

  shuffle() {
    const cardAreaCards = [...this.cardArea.children];
    const cardCount = cardAreaCards.length;
    if (cardCount > 0) {
      for (index = 0; index < cardCount; index++) {
        cardAreaCards[index].remove();
      }
    }
    if (this.activeCard !== null) {
      this.activeCard?.classList.remove('selected');
      this.activeCard?.classList.remove('active');
    }
    let currentIndex = this.cardSet.length; let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.cardSet[currentIndex], this.cardSet[randomIndex]] = [this.cardSet[randomIndex], this.cardSet[currentIndex]];
    }
    this.cardSet[0].element.classList.add('active');
    this.activeCard = this.cardSet[0];
    this.activeCardSetIndex = 0;
    const cardSetCount = this.cardSet.length;
    for (let index = 0; index < cardSetCount; index++) {
      this.cardArea.appendChild(this.cardSet[index].element);
    }
  }

  shuffleAndPlaceCards() {
    if (globalThis?.invictus?.consistentCardOrder === false) {
      let currentIndex = this.cardSet.length; let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this.cardSet[currentIndex], this.cardSet[randomIndex]] = [this.cardSet[randomIndex], this.cardSet[currentIndex]];
      }
    }
    const cardSetCount = this.cardSet.length;
    for (let index = 0; index < cardSetCount; index++) {
      this.cardArea.appendChild(this.cardSet[index].element);
    }
  }

  makeInvictusBlock() {
    /* Menu Bar */
    const titleBar = this.makeInvictusElement(['title-bar'], 'span', undefined, this.title);
    this.showButton = this.makeInvictusElement(['show-flip-cards', 'right'], 'button', undefined, 'Show Flip Cards');
    this.closeButton = this.makeInvictusElement(['close-flip-cards', 'right', 'hidden'], 'button', undefined, '✕');
    this.closeButton.title = 'Hide Flip Cards';
    this.shuffleButton = this.makeInvictusElement(['shuffle-flip-cards', 'right', 'hidden'], 'button', undefined, 'Shuffle');
    this.shuffleButton.title = 'Randomize Flip Cards Order';
    const menuBar = this.makeInvictusElement(['menu-bar'], 'div', [titleBar, this.showButton, this.closeButton, this.shuffleButton]);
    /* Card Area */
    this.previousCardButton = this.makeInvictusElement(['previous-card'], 'div', undefined, '🞀');
    this.cardArea = this.makeInvictusElement(['card-area'], 'div');
    this.nextCardButton = this.makeInvictusElement(['next-card'], 'div', undefined, '🞂');
    this.cardAreaWrapper = this.makeInvictusElement(['card-area-wrapper', 'hidden'], 'div', [this.previousCardButton, this.cardArea, this.nextCardButton]);
    this.outerWrapper = this.makeInvictusElement(['flip-container'], 'div', [menuBar, this.cardAreaWrapper]);
    return this.outerWrapper;
  }

}
