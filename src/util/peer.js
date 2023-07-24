export class PassiveConsole {
  constructor(consoleInstance, directAttach = false) {
    this.consoleInstance = consoleInstance;
    this.countMap = new Map();
    this.#defaultCount = Symbol('count');
    countMap.set(this.#defaultCount, 0);

    if (directAttach) {
      consoleInstance.assert = this.assert;
      consoleInstance.clear = this.clear;
      consoleInstance.count = this.count;
      consoleInstance.countReset = this.countReset;
      consoleInstance.debug = this.debug;
      consoleInstance.dir = this.dir;
      consoleInstance.dirxml = this.dirxml;
      consoleInstance.group = this.group;
      consoleInstance.groupCollapsed = this.groupCollapsed;
      consoleInstance.groupEnd = this.groupEnd;
      consoleInstance.info = this.info;
      consoleInstance.log = this.log;
      consoleInstance.time = this.time;
      consoleInstance.timeEnd = this.timeEnd;
      consoleInstance.timeLog = this.timeLog;
      consoleInstance.trace = this.trace;
      consoleInstance.warn = this.warn;

      if (consoleInstance.profile) consoleInstance.profile = this.profile;
      if (consoleInstance.profileEnd) consoleInstance.profileEnd = this.profileEnd;
      if (consoleInstance.timeStamp) consoleInstance.timeStamp = this.timeStamp;
    }
  }

  assert(...args) {
    this.consoleInstance.assert(...args);
    return args[0];
  }

  clear(...args) {
    this.consoleInstance.clear(...args);
    return args[0];
  }

  count(label) {
    if (label === undefined) label = this.#defaultCount;
    const currentCount = this.countMap.get(label);
    this.countMap.set(label, currentCount === undefined ? 1 : this.countMap.get(label) + 1);
    this.consoleInstance.count(label);
    return currentCount;
  }

  countReset(label) {
    if (label === undefined) label = this.#defaultCount;
    this.countMap.set(label, 0);
    this.consoleInstance.countReset(label);
    return 0;
  }

  debug(...args) {
    this.consoleInstance.debug(...args);
    return args[0];
  }

  dir(...args) {
    this.consoleInstance.dir(...args);
    return args[0];
  }

  dirxml(...args) {
    this.consoleInstance.dirxml(...args);
    return args[0];
  }

  error(...args) {
    this.consoleInstance.error(...args);
    return args[0];
  }

  group(...args) {
    this.consoleInstance.group(...args);
    return args[0];
  }

  groupCollapsed(...args) {
    this.consoleInstance.groupCollapsed(...args);
    return args[0];
  }

  groupEnd(...args) {
    this.consoleInstance.groupEnd(...args);
    return args[0];
  }

  info(...args) {
    this.consoleInstance.info(...args);
    return args[0];
  }

  log(...args) {
    this.consoleInstance.log(...args);
    return args[0];
  }

  profile(...args) {
    if (this.consoleInstance.profile) this.consoleInstance.profile(...args);
    return args[0];
  }

  profileEnd(...args) {
    if (this.consoleInstance.profileEnd) this.consoleInstance.profileEnd(...args);
    return args[0];
  }

  table(...args) {
    this.consoleInstance.table(...args);
    return args[0];
  }

  time(...args) {
    this.consoleInstance.time(...args);
    return args[0];
  }

  timeEnd(...args) {
    this.consoleInstance.timeEnd(...args);
    return args[0];
  }

  timeLog(...args) {
    this.consoleInstance.timeLog(...args);
    return args[0];
  }

  timeStamp(...args) {
    if (this.consoleInstance.timeStamp) this.consoleInstance.timeStamp(...args);
    return args[0];
  }

  trace(...args) {
    this.consoleInstance.trace(...args);
    return args[0];
  }

  warn(...args) {
    this.consoleInstance.warn(...args);
    return args[0];
  }
}

/**
 * Logs a message to the console (Preserved Through Build) and Returns the first argument
 * @param  {...any} args argumensts passed to native console.debug
 * @returns {any} The first argument
 */
export function peer(...args) {
  console['debug'](...args);
  return args[0];
}
