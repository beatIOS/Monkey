import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGambleGameSelectC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotGambleGameSelectC2S extends BaseMsgC2S {
}

/**
 * @class SlotGambleGameSelectS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGambleGameSelectS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // SlotGameGambleDTO
  }
}
