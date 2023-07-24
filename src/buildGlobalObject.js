import { nonDestructiveAssign } from './util/nonDestructiveAssign.js';

export function buildGlobalObject() {
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
    },
    version: '1.0.0',
    updateCheckPerformed: false
  };

  if (globalThis.invictus === undefined) globalThis.invictus = {};
  nonDestructiveAssign(globalThis.invictus, object);
}
