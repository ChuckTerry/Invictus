(() => {
  class FlashCard {
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
class FlashCardSet {
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
    const FlashCardClass = typeof FlashCard === 'undefined' ? globalThis.invictus.classDefinitions.FlashCard : FlashCard;
    const cardCount = json.FlashCards.length;
    for (let index = 0; index < cardCount; index++) {
      const cardData = json.FlashCards[index];
      const card = new FlashCardClass(cardData);
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
    this.showButton.addEventListener('click', () => {
      this.showButton.classList.add('hidden');
      this.closeButton.classList.remove('hidden');
      this.shuffleButton.classList.remove('hidden');
      this.cardAreaWrapper.classList.remove('hidden');
      this.outerWrapper.classList.add('expanded');
    });
    this.closeButton.addEventListener('click', () => {
      this.closeButton.classList.add('hidden');
      this.shuffleButton.classList.add('hidden');
      this.showButton.classList.remove('hidden');
      this.cardAreaWrapper.classList.add('hidden');
      this.outerWrapper.classList.remove('expanded');
    });
    this.shuffleButton.addEventListener('click', () => {
      this.shuffle();
    });
    this.previousCardButton.addEventListener('click', () => {
      this.activeCard.element.classList.toggle('active');
      this.activeCard.element.classList.remove('selected');
      this.activeCardSetIndex = this.activeCardSetIndex === 0 ? this.cardSet.length - 1 : this.activeCardSetIndex - 1;
      this.activeCard = this.cardSet[this.activeCardSetIndex];
      this.activeCard.element.classList.toggle('hidden');
      this.activeCard.element.classList.toggle('active');
    });
    this.nextCardButton.addEventListener('click', () => {
      this.activeCard.element.classList.toggle('active');
      this.activeCard.element.classList.remove('selected');
      this.activeCardSetIndex = this.activeCardSetIndex === this.cardSet.length - 1 ? 0 : this.activeCardSetIndex + 1;
      this.activeCard = this.cardSet[this.activeCardSetIndex];
      this.activeCard.element.classList.toggle('hidden');
      this.activeCard.element.classList.toggle('active');
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
      for (let index = 0; index < cardCount; index++) {
        cardAreaCards[index].remove();
      }
    }
    if (this.activeCard !== null) {
      this.activeCard?.element.classList.remove('selected');
      this.activeCard?.element.classList.remove('active');
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
    const titleBar = this.makeInvictusElement(['title-bar'], 'span', undefined, this.title);
    this.showButton = this.makeInvictusElement(['show-flip-cards', 'right'], 'button', undefined, 'Show Flip Cards');
    this.closeButton = this.makeInvictusElement(['close-flip-cards', 'right', 'hidden'], 'button', undefined, '✕');
    this.closeButton.title = 'Hide Flip Cards';
    this.shuffleButton = this.makeInvictusElement(['shuffle-flip-cards', 'right', 'hidden'], 'button', undefined, 'Shuffle');
    this.shuffleButton.title = 'Randomize Flip Cards Order';
    const menuBar = this.makeInvictusElement(['menu-bar'], 'div', [titleBar, this.showButton, this.closeButton, this.shuffleButton]);
    this.previousCardButton = this.makeInvictusElement(['previous-card'], 'div', undefined, '🞀');
    this.cardArea = this.makeInvictusElement(['card-area'], 'div');
    this.nextCardButton = this.makeInvictusElement(['next-card'], 'div', undefined, '🞂');
    this.cardAreaWrapper = this.makeInvictusElement(['card-area-wrapper', 'hidden'], 'div', [this.previousCardButton, this.cardArea, this.nextCardButton]);
    this.outerWrapper = this.makeInvictusElement(['flip-container'], 'div', [menuBar, this.cardAreaWrapper]);
    return this.outerWrapper;
  }
}
function nonDestructiveAssign(target, source) {
  const entries = Object.entries(source);
  const length = entries.length;
  for (let index = 0; index < length; index++) {
    const [key, value] = entries[index];
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (target[key] === undefined) target[key] = [];
        if (!Array.isArray(target[key])) {
          target[key] = [target[key]];
        }
        const valueLength = value.length;
        for (let valueIndex = 0; valueIndex < valueLength; valueIndex++) {
          const item = value[valueIndex];
          if (!target[key].includes(item)) target[key].push(item);
        }
      } else if (value === null) {
        if (target[key] === undefined) target[key] = null;
      } else {
        if (target[key] === undefined) target[key] = {};
        const replacement = nonDestructiveAssign(target[key], value);
        target[key] = replacement;
      }
    } else {
      if (target[key] === undefined) target[key] = value;
    }
  }
  return target;
}
function cipher_Numeric2Alpha(numberOrString, preserveNonNumeric = false, lowercase = true) {
  const characterCipher = lowercase
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const characterArray = [...numberOrString.toString()];
  return characterArray.reduce((accumulator, character) => {
    return accumulator + (characterCipher[character] || (preserveNonNumeric ? character : ''));
  }, '');
}
function makeUuid() {
  const epoch = Date.now().toString().slice(0, 10);
  const random = Math.random().toString().slice(2, 12);
  return 'uuid-' + cipher_Numeric2Alpha(`${random}-${epoch}`, true);
}
(() => {
  window.addEventListener('load', async () => {
    const notInEditMode = !document.querySelector('#usernavigation input[name=setmode]')?.checked;
    const topLinkAlreadyExists = document.querySelector('.invictus-nav-top') !== null;
    if (notInEditMode || topLinkAlreadyExists !== null) {
      return;
    }
    const elementOuterHtml = '<li class="nav-item nav-link invictus-nav-top" role="menuitem" data-key="flashcards" data-forceintomoremenu="false" tabindex="-1">Invictus<a></a></li>';
    const element = document.createElement('li');
    const parent = document.querySelector('.primary-navigation > nav > ul');
    const firstHiddenLi = parent.querySelector('.d-none');
    parent.insertBefore(element, firstHiddenLi);
    element.outerHTML = elementOuterHtml;
  });
})();
  function checkForUpdates() {
  const versionUrl = 'https://chuckterry.me/projects/invictus/version.txt';
  const version = globalThis?.invictus?.version;
  if (document.querySelector('#usernavigation input[name=setmode]')?.checked !== true) return;
  if (version === undefined || invictus?.updateCheckPerformed === true) return;
  invictus.updateCheckPerformed = true;
  fetch(versionUrl)
    .then(response => response.text())
    .then(versionText => {
      if (versionText.indexOf(version) === -1) {
        const updateNotification = document.createElement('div');
        updateNotification.classList.add('fixed-bottom', 'invictus-update-notification');
        updateNotification.innerHTML = '<a id="invictus-update-link" href="#">A new version of invictus is available!</a>';
        document.body.appendChild(updateNotifier);
      }
    })
    .catch(error => {
      invictus.updateCheckPerformed = false;
    });
}
function buildGlobalObject() {
  const object = {
    classDefinitions: {
      FlashCardSet: null,
      FlashCard: null
    },
    flashCards: {
      sets: [],
      config: {
        consistentStartOrder: true,
        allowHighlighting: true,
        allowDownload: {
          text: true,
          html: true,
          json: false
        },
        forceLightMode: false,
        allowShuffle: true
      }
    },
    version: '1.0.0',
    updateCheckPerformed: false
  };
  if (globalThis.invictus === undefined) globalThis.invictus = {};
  nonDestructiveAssign(globalThis.invictus, object);
}
  buildGlobalObject();
  invictus.classDefinitions.FlashCardSet = FlashCardSet;
  invictus.classDefinitions.FlashCard = FlashCard;
  if (document.querySelector('#invictus-stylesheet') === null) {
    const stylesheet = document.createElement('style');
    stylesheet.innerText = `:root {
  --border-blue: #356995;
  --flash-card-background: #CFDBE6;
  --title-color: #07243C;
  --white: #FFFFFF;
  --black: #010101;
}
body {
  margin: 0;
  width: 100%;
  height: 100%;
}
.invictus.placeholder {
  display: none;
}
.title-bar {
  padding-left: 10px;
  padding-right: 20px;
  font-variant: small-caps;
  font-weight: 500;
  font-size: 22pt;
  line-height: 90%;
  color: var(--title-color);
}
div.invictus.flip-container {
  width: 80%;
  border-radius: 20px;
  color: #0F4C81;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-shadow: 2px 2px 3px 0px rgba(0, 50, 150, 0.28);
  margin: 8px 0 12px 40px;
}
.menu-bar {
  background-color: #E5ECF1;
  padding: 14px;
  border-radius: 20px;
}
div.invictus.flip-container.expanded .menu-bar {
  border-radius: 20px 20px 0px 0px;
}
.menu-bar > button {
  float: right;
  margin-left: 10px;
  border-radius: 6px;
  border: 1px solid var(--border-blue);
  border-bottom: 2px solid var(--border-blue);
  border-right: 2px solid var(--border-blue);
  background-color: #F5F8FA;
}
.menu-bar > button:hover {
  background-color: var(--white);
  scale: 112%;
}
.invictus.close-flip-cards {
  background-color: #ae5858;
  color: var(--white);
  width: 30px;
}
.menu-bar > .invictus.close-flip-cards:hover {
  background-color: #D99696;
  color: #8E1717;
  -webkit-text-stroke: 2px;
}
.invictus.card-area-wrapper > div {
  display: inline-block;
}
.invictus.card-area-wrapper {
  padding-top: 12px;
  text-align: center;
  background-color: #F5F8FA;
  border-top: 1.5px solid var(--border-blue);
  border-radius: 0px 0px 20px 20px;
}
.invictus.card-area>div.selected {
  background-color: transparent;
  border: none;
}
.card-wrapper {
  background-color: transparent;
  width: 600px;
  height: 450px;
  perspective: 1000px;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
div.selected .card-inner {
  transform: rotateY(180deg);
}
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;background-color: var(--flash-card-background);
  border: 2px solid var(--border-blue);
}
.card-back {
  background-repeat: no-repeat;
  transform: rotateY(180deg);
}
div.invictus.card-wrapper {
  display: none;
  position: relative;
  right: -300px;
}
div.invictus.card-wrapper.active {
  display: inline-block;
  right: 0px;
  transition: 1s;
}
.next-card,
.previous-card {
  color: #5C86A9;
  -webkit-text-stroke: 2px #0F4C81;
  position: relative;
  font-size: 80pt;
  z-index: 0;
  line-height: 450px;
  vertical-align: top;
  -webkit-user-select: none;
  user-select: none;
  transition: 0.5s ease-out;
  cursor: pointer;
}
.next-card:hover,
.previous-card:hover {
  scale: 150%;
  color: #28a8ce;
  transition: 0.65s ease-out;
}
.next-card:active,
.previous-card:active {
  color: var(--white);
  transition: 0.1s;
}
.next-card {
  right: -5px;
}
.next-card:hover {
  right: -5px;
}
.previous-card {
  left: -5px;
}
.previous-card:hover {
  right: -10px;
}
.card-term,
.card-definition {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}
.term-text,
.definition-text {
  margin-top: 1rem;
  margin-bottom: 0rem;
  font-size: 18pt;
  font-weight: 500;
  padding: 36px;
  border-image: linear-gradient(90deg, transparent 0%, #F5F8FA 50%, transparent 100%);
  border-width: 3px;
  border-style: solid;
  border-image-slice: 0.5;
}
.card-wrapper,
.card-inner,
.card-front,
.card-back {
  border-radius: 30px;
}
.invictus-update-notification {
  width: 100%;
  height: auto;
  background-color: var(--flash-card-background);
  z-index: 1000;
  border-top: 1px solid var(--black);
}`;
    stylesheet.id = 'invictus-stylesheet';
    document.head.appendChild(stylesheet);
  }
})();