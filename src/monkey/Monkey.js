import {GameService} from './GameService';
import {Context} from './Context';
import {GAME_MODE} from './GameMode';
import {STATE} from './State';
import $ from 'jquery';
import {Utils} from './Utils';

/**
 * @author ligang.yao
 */
export class Monkey {

  constructor(listener, cycles, gameId, account, host, bet) {
    this.ctx = new Context();

    this.numRounds                = cycles;
    this.listener                 = listener;
    this.ctx.GAME.ID              = gameId;
    this.ctx.BACKEND.TEST_ACCOUNT = account;
    this.ctx.betPerLine           = bet;

    this.numBaseGames  = 0;
    this.numFreeGames  = 0;
    this.numBonusGames = 0;

    this.totalBet = 0;
    this.totalWin = 0;

    this.startBalance = 0;

    this.reRequestCount = 0;//接口已尝试的次数
    this.reRequestMax   = 10;//接口失败的最大尝试次数
    this.errCount       = 0;//接口返回失败的次数

    this.startTimestamp  = new Date();
    this.finishTimestamp = new Date();

    // this.ctx.BACKEND.HOST            = 'wss://qa-rgs.gameiom.com/platform';
    // this.ctx.BACKEND.TEST_TOKEN_HOST = 'qa-rgs.gameiom.com/rgs';

    this.ctx.BACKEND.HOST            = 'wss://' + host + '/platform';
    // https://rmg-dev.aspectgaming.com
    this.ctx.BACKEND.TEST_TOKEN_HOST = host + '/rgs';
    this.ctx.BACKEND.OPERATOR_ID     = 1;

    this.ctx.game = this;

    this.isStopping = false;
  }

  onStopped(msg) {
    this.log();
    console.log(msg);

    if (this.listener) {
      this.listener.onStopped(msg);
    }

    this.finishTimestamp = new Date();
    console.log('Start time: ' + this.startTimestamp);
    console.log('Stop time: ' + this.finishTimestamp);
  }

  start() {
    $.ajax({
      url:     this.ctx.TOKEN_TEST_URL,
      timeout: 15000,
      type:    'GET',
      headers: {
        'gameProvider': 3
      },
      success: (result) => {
        console.log('[Game:Token]', JSON.stringify(result));
        this.ctx.token = result.token;
        this.restartService();
      },
      error:   (jqXHR, textStatus, errorThrown) => {
        console.error('Failed to get token from: ', this.ctx.TOKEN_TEST_URL);
      }
    });
  }

  restartService() {
    this.stop();

    this.isStopping = false;
    this.net        = new GameService(this.ctx);
    this.net.start(() => this.onReady(), (retcode) => this.onDisconnected(retcode));
  }

  stop() {
    if (this.net) {
      this.net.stop();
      this.net = null;
    }
    this.isStopping = true;
  }

  onDisconnected(retCode) {
    console.warn('Error: ' + retCode);
    if (retCode === this.ctx.ERR_COMM_LOST_CODE) {
      setTimeout(() => {
        this.errCount++;
        this.reRequestCount++;

        if (this.reRequestCount < this.reRequestMax) {
          this.restartService();
        } else {
          this.onStopped('Stop due to error:' + retCode);
        }
      }, 1000);
    } else {
      this.onStopped('Stop due to error:' + retCode);
    }
  }

  onReady() {
    console.log('OK');

    this.startBalance = this.ctx.balance;

    this.log();
    this.playGame();
  }

  playGame() {
    console.log('gameState ' + this.ctx.gameState);

    switch (this.ctx.gameState) {
      case STATE.GAME_IDLE:
      case STATE.GAMBLE_OR_TAKE:
        this.playBaseGame();
        break;

      case STATE.FREE_GAME:
        if (this.ctx.freeGame.currentFreeGameIndex >= this.ctx.freeGame.totalFreeGameIndex) {
          this.startOutro();
        } else {
          this.playFreeGame();
        }
        break;

      case STATE.FREE_GAME_INTRO:
        this.startIntro();
        break;

      case STATE.FREE_GAME_OUTRO:
        this.startOutro();
        break;
      case STATE.BONUS_GAME:
        this.startBonusGame();
        break;
      case STATE.BONUS_OUTRO:
        this.startBonusGameOutro();
        break;

      default:
        return;
    }
  }

  playBaseGame() {
    if (this.isStopping) {
      this.onStopped('Stop due to user cancelled');
      return;
    }
    console.log('playBaseGame');

    if (this.ctx.balance > this.ctx.totalBet) {
      this.ctx.balance = this.ctx.balance - this.ctx.totalBet;
    } else {
      this.onStopped('Stop due to low balance');
      return;
    }
    if (this.reRequestCount === 0) {
      this.totalBet += this.ctx.totalBet;
    }
    this.ctx.baseGameWon  = 0;
    this.ctx.lastAccumWin = 0;

    this.net.playBaseGame(() => {
      this.totalWin += this.ctx.win;
      this.reRequestCount = 0;
      this.numBaseGames++;
      this.log();

      if (this.listener) {
        this.listener.updateStatus();
      }

      this.numRounds--;
      if (this.numRounds > 0) {
        this.playGame();
      } else {
        this.onStopped("Completed successfully");
      }
    });

  }

  playFreeGame() {
    console.log('playFreeGame');

    const free = this.ctx.freeGame;

    free.freeGameWon = 0;
    free.stops       = null;

    this.net.playFreeGame(() => {
      free.currentFreeGameIndex++;
      this.totalWin += this.ctx.win;
      this.reRequestCount = 0;
      this.numFreeGames++;
      this.log();

      this.playGame();
    });
  }

  startIntro() {
    console.log('startIntro');

    this.net.enterFreeGame(() => {
      this.reRequestCount = 0;
      this.ctx.gameMode   = GAME_MODE.FREE_GAME;
      this.playFreeGame();
    });
  }

  startOutro() {
    console.log('startOutro');

    this.net.exitFreeGame(() => {
      this.reRequestCount = 0;
      this.ctx.gameMode   = GAME_MODE.BASE_GAME;
      this.playGame();
    });
  }

  startBonusGame() {
    console.log('startBonusGame');
    let bonusPickNum = Utils.random(0, this.ctx.bonus.numPicks);
    this.net.pickBonus(bonusPickNum, () => {
      this.reRequestCount = 0;
      this.playGame();
    });
  }

  startBonusGameOutro() {
    console.log('startBonusGameOutro');

    this.net.exitBonus(() => {
      this.reRequestCount = 0;
      this.numBonusGames++;
      this.playGame();
    });
  }

  getBonusMask() {
    let bonusResultMask  = parseInt(this.ctx.bonus.mask, 10).toString(2);
    let choosenIndexList = bonusResultMask.split('').reverse();
    let bonusGameIndex   = 0;
    for (let key in choosenIndexList) {
      if (choosenIndexList[key] === 1) {
        bonusGameIndex = bonusGameIndex + 1;
      }
    }
    return bonusGameIndex;
  }

  refreshMeters() {
  }

  log() {
    console.log('BaseGames:' + this.numBaseGames + ' FreeGames:' + this.numFreeGames + ' BonusGames:' + this.numBonusGames + ' TotalBet:' + this.totalBet + ' TotalWin:' + this.totalWin + ' Balance:' + this.startBalance + ' -> ' + this.ctx.balance + " |errCount:" + this.errCount + ' |RTP:' + this.totalWin / this.totalBet);
  }
}

window.onload = function () {
  new Monkey(10000, 2, 'aspect_monkey3');
};
