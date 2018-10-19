import {BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGameRegisterForOnlineGameC2S
 * @author ligang.yao
 */
export class SlotGameRegisterForOnlineGameC2S {
}

/**
 * @class SlotGameRegisterForOnlineGameS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGameRegisterForOnlineGameS2C extends BaseMsgS2C {
  constructor() {
    super();

    /** @type {SlotGameBaseGameDTO} */
    this.baseGame = null;    // SlotGameBaseGameDTO

    /** @type {Object} */
    this.object = null;      // Object: SlotFreeGameDTO | SlotGameBonusDTO | SlotGameGambleDTO

    /** @type {PlayerDTO} */
    this.player = null;      // PlayerDTO, only in rest implementation

    /** @type {string} */
    this.sessionId = null;   // String, only in rest implementation

    /** @type {ReelStripDTO[]} */
    this.reelStrip = null;   // ReelStripDTO[]

    /** @type {string} */
    this.perLineRule = null; // String

    /** @type {number} */
    this.defaultBet = null;  // Integer

    /** @type {string} */
    this.stateData = null;
  }
}
