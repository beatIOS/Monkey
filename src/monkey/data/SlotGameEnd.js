import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGameEndC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotGameEndC2S extends BaseMsgC2S {
}

/**
 * @class SlotGameEndS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGameEndS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.baseGame = null; // SlotGameBaseGameDTO
  }
}
