import {BaseMsgC2S, BaseMsgS2C} from './BaseMsg';

/**
 * @class SlotGameRefreshBalanceC2S
 * @augments BaseMsgC2S
 * @author ligang.yao
 */
export class SlotGameRefreshBalanceC2S extends BaseMsgC2S {
}

/**
 * @class SlotGameRefreshBalanceS2C
 * @augments BaseMsgS2C
 * @author ligang.yao
 */
export class SlotGameRefreshBalanceS2C extends BaseMsgS2C {
  constructor() {
    super();

    this.totalCash = null; // long
  }
}
