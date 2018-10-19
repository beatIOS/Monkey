/**
 * @class SingleResultDTO
 * @author ligang.yao
 */
export class SingleResultDTO {
  constructor() {
    this.stops                  = null; // int[]
    this.selectionWin           = null; // int[]
    this.selectionWinMultiplier = null; // int[]
    this.selectionSymMask       = null; // int[]
    this.scatterWinMask         = 0; // int
    this.scatterWin             = 0; // int
    this.scatterWinMultiplier   = 0; // int
    this.freeSpinsWon           = 0; // int
    this.specialMask            = 0; // int
  }
}
