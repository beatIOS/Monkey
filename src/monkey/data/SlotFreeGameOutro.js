import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotFreeGameOutroC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotFreeGameOutroC2S extends BaseMsgC2S {
}

/**
 * @class SlotFreeGameOutroS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotFreeGameOutroS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // Object: SlotFreeGameDTO | SlotGameBonusDTO | SlotGameGambleDTO
  }
}
