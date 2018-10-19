import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotFreeGamePlayC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotFreeGamePlayC2S extends BaseMsgC2S {
}

/**
 * @class SlotFreeGamePlayS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotFreeGamePlayS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // Object: SlotFreeGameDTO | SlotGameBonusDTO | SlotGameGambleDTO
  }
}
