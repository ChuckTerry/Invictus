class FlashCardSet {
  constructor(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
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
      const term = cardData.Term.Content;
      const definition = cardData.Definition.Content;
      const card = this.createCard(term, definition);
      this.cardSet.push(card);
    }
    invictus.flashCardSets.push(this);

    this.invictusBlock = this.makeInvictusBlock();
    this.element.appendChild(this.invictusBlock);
    this.shuffleAndPlaceCards();
    this.cardSet[0].classList.add('active');
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
      classNames.forEach(name => element.classList.add(name));
    }
    if (childrenArray instanceof HTMLElement) {
      childrenArray = [childrenArray];
    }
    if (Array.isArray(childrenArray)) {
      childrenArray.forEach(child => element.appendChild(child));
    }
    if (type === 'button') {
      element.type = 'button';
    }
    if (innerText) {
      element.innerText = innerText;
    }
    return element;
  }

  createCard(term, definition) {
    /* Term Elements */
    const termText = this.makeInvictusElement('term-text', 'p', undefined, term);
    const cardTerm = this.makeInvictusElement('card-term', 'div', termText);
    const front = this.makeInvictusElement('card-front', 'div', cardTerm);
    /* Definition Elements */
    const definitionText = this.makeInvictusElement('definition-text', 'p', undefined, definition);
    const cardDefinition = this.makeInvictusElement('card-definition', 'div', definitionText);
    const back = this.makeInvictusElement('card-back', 'div', cardDefinition);
    /* Element Assembly */
    const inner = this.makeInvictusElement('card-inner', 'div', [front, back]);
    const outerCardWrapper = this.makeInvictusElement('card-wrapper', 'div', inner);
    return outerCardWrapper;
  }

  shuffle() {
    const cardAreaCards = [...this.cardArea.children];
    if (cardAreaCards.length > 0) {
      cardAreaCards.forEach(card => card.remove());
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
    this.cardSet[0].classList.add('active');
    this.activeCard = this.cardSet[0];
    this.activeCardSetIndex = 0;
    this.cardSet.forEach(card => {
      this.cardArea.appendChild(card);
    });
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
    this.cardSet.forEach(card => {
      card.firstChild.addEventListener('click', this.flipCard);
      this.cardArea.appendChild(card);
    });
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

  flipCard(eventOrHtmlElement) {
    const cardElement = eventOrHtmlElement instanceof HTMLElement ? eventOrHtmlElement : eventOrHtmlElement.currentTarget;
    cardElement.parentElement.classList.toggle('selected');
  }

}
