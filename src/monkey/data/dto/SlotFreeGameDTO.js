/**
 * @class SlotFreeGameDTO
 * @author ligang.yao
 */
export class SlotFreeGameDTO {
  constructor() {
    this.objName = null; // String

    this.totalWager           = 0; // Long
    this.freeGameWon          = 0; // Long
    this.totalFreeGameWon     = 0; // Long
    this.currentFreeGameIndex = 0; // Integer
    this.totalFreeGameIndex   = 0; // Integer
    this.freeSpinsWon         = 0; // int
    this.stops                = null; // String
    this.winLineInfo          = null; // String[]
    this.mathSpecificParams   = null; // Map<String, String>
    this.scatterInfo          = null; // String
  }
}
