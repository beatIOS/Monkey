/**
 * @class WinLine
 * @author ligang.yao
 */
export class WinLine {

  constructor(ctx, game, info) {
    const params    = info.split(',');
    this.winAmount  = parseInt(params[2], 10);
    this.scatterNum = 0;

    if (params[0] === 'Scatter') {
      const stops = game.stops;
      for (let i = 0, len = stops.length; i < len; i++) {
        if (stops[i] === ctx.MATH.SYMBOL.SCATTER) {
          this.scatterNum++;
        }
      }
      // In some games 3 scatters only trigger free spins with no win amount
      this.isValid = this.winAmount > 0 || ctx.freeSpinsWon >= 5; // >=5 only happens when trigger free games
      this.line    = -1;                      // -1: scatter
    } else {
      this.isValid = this.winAmount > 0;
      this.line    = parseInt(params[0], 10); // 0: way in ways game, 0 - 49 for 50 lines, 50-99 for right to left 50 lines.
    }

    if (!this.isValid) return; // happens in math which set scatter mask even no win

    this.multiplier  = parseInt(params[3], 10);
    this.resultIndex = parseInt(params[4], 10);
  }

  getWinAmount() {
    return this.winAmount;
  }
}
