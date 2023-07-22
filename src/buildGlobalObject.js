import { nonDestructiveAssign } from './util/nonDestructiveAssign.js';

(() => {
  const object = {
    classDefinitions: {
      FlashCardSet: null
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
    }
  };

  if (globalThis.invictus === undefined) globalThis.invictus = {};
  nonDestructiveAssign(globalThis.invictus, object);
})();
