import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotBonusGameOutroC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotBonusGameOutroC2S extends BaseMsgC2S {
}

/**
 * @class SlotBonusGameOutroS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotBonusGameOutroS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // Object: SlotFreeGameDTO | SlotGameBonusDTO | SlotGameGambleDTO
  }
}
