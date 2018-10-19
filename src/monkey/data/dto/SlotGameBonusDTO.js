/**
 * @class SlotGameBonusDTO
 * @author ligang.yao
 */
export class SlotGameBonusDTO {

  constructor() {
    this.objName = null; // String

    this.complete           = false;
    this.numPicks           = 0;
    this.maxSelectableBonus = 0;
    this.win                = 0;
    this.numFreeGamesWon    = 0;
    this.multiplier         = 0;
    this.mask               = 0;
    this.values             = null;
  }
}
