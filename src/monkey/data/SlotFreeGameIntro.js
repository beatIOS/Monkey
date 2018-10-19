import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotFreeGameIntroC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotFreeGameIntroC2S extends BaseMsgC2S {
}

/**
 * @class SlotFreeGameIntroS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotFreeGameIntroS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
    this.object   = null; // SlotFreeGameDTO
  }
}
