/**
 * @class BaseMsgC2S
 * @author ligang.yao
 */
export class BaseMsgC2S {
  constructor() {
    /** @type {string} */
    this.stateData = null;
  }
}

/**
 * @class BaseMsgS2C
 * @author ligang.yao
 */
export class BaseMsgS2C {
  constructor() {
    /** @type {string} */
    this.msgId = null;   // String

    /** @type {string} */
    this.result = null;  // String

    /** @type {number} */
    this.retCode = 0;    // int

    /** @type {string} */
    this.retDesc = null; // String
  }
}
