/**
 * @class SlotGameGambleDTO
 * @author ligang.yao
 */
export class SlotGameGambleDTO {

  constructor() {
    this.objName = null;  // String

    this.gambleWon             = false; // Boolean
    this.gambleCardDrawHistory = ''; // String
    this.gambleCradDraw        = 0; // Integer
    this.gambleSelection       = 0; // Integer
    this.gambleWager           = 0; // Long
    this.currentGambleIndex    = 0; // Integer
  }
}
