import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotBonusGameSelectC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotBonusGameSelectC2S extends BaseMsgC2S {
}

/**
 * @class SlotBonusGameSelectS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotBonusGameSelectS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // SlotGameBonusDTO
  }
}
