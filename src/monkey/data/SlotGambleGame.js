import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGambleGameC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotGambleGameC2S extends BaseMsgC2S {
}

/**
 * @class SlotGambleGameS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGambleGameS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // SlotGameGambleDTO
  }
}
