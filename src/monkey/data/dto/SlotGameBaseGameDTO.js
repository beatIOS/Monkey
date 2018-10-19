/**
 * @class SlotGameBaseGameDTO
 * @author ligang.yao
 */
export class SlotGameBaseGameDTO {
  constructor() {
    this.baseGameWon        = 0; // Long
    this.rtp                = 0; // Double
    this.line               = 0; // Integer
    this.bet                = 0; // Integer
    this.totalCash          = 0; // Long
    this.totalWager         = 0; // Long
    this.lastAccumWin       = 0; // Long
    this.freeSpinsWon       = 0; // int
    this.stops              = null;  // String
    this.winLineInfo        = null;  // String[]
    this.mathSpecificParams = null;  // Map<String, String>
    this.singleResult       = null;  // SingleResultDTO
    this.scatterInfo        = null;  // String
    this.gameState          = null;  // String
    this.gambleOn           = false; // boolean
  }
}
