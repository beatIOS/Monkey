import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGamePlayC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotGamePlayC2S extends BaseMsgC2S {
}

/**
 * @class SlotGamePlayS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGamePlayS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // Object: SlotFreeGameDTO | SlotGameBonusDTO | SlotGameGambleDTO
  }
}
