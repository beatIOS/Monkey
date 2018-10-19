import {Utils} from '../Utils';
import {STATE} from '../State';
import {CMD} from './HttpCommand';
import {
  SlotBonusGameOutroC2S,
  SlotBonusGameSelectC2S,
  SlotFreeGameIntroC2S,
  SlotFreeGameOutroC2S,
  SlotFreeGamePlayC2S,
  SlotGambleGameC2S,
  SlotGambleGameSelectC2S,
  SlotGameEndC2S,
  SlotGamePlayC2S,
  SlotGameRefreshBalanceC2S,
  SlotGameRegisterForOnlineGameC2S,
  WinLine
} from '../data';
import $ from 'jquery';

/**
 * @class HttpController
 * @author ligang.yao
 */
export class HttpController {

  constructor(ctx) {
    this.ctx = ctx;

    /**
     * @type {string}
     * @private
     */
    this.aspectUid = null;
    /**
     * @type {string}
     */
    this.logSessionId = null;

    /**
     * @type {boolean}
     */
    this.isConnected = false;

    /**
     * @type {function}
     */
    this.onConnected = null;
    /**
     * @type {function}
     */
    this.onDisconnected = null;
    /**
     *
     * @type {number}
     */
    this.ctx.retCode = null;

    /**
     * @type {SlotBonusGameOutroC2S}
     */
    this.bonusOutroData = new SlotBonusGameOutroC2S();
    /**
     * @type {SlotBonusGameSelectC2S}
     */
    this.bonusSelectData = new SlotBonusGameSelectC2S();
    /**
     * @type {SlotGamePlayC2S}
     */
    this.gamePlayData = new SlotGamePlayC2S();
    /**
     * @type {SlotFreeGameIntroC2S}
     */
    this.freeIntroData = new SlotFreeGameIntroC2S();
    /**
     * @type {SlotFreeGamePlayC2S}
     */
    this.freePlayData = new SlotFreeGamePlayC2S();
    /**
     * @type {SlotFreeGameOutroC2S}
     */
    this.freeOutroData = new SlotFreeGameOutroC2S();
    /**
     * @type {SlotGambleGameC2S}
     */
    this.gambleGameData = new SlotGambleGameC2S();
    /**
     * @type {SlotGambleGameSelectC2S}
     */
    this.gambleSelectData = new SlotGambleGameSelectC2S();
    /**
     * @type {SlotGameEndC2S}
     */
    this.endGameData = new SlotGameEndC2S();
    /**
     * @type {SlotGameRefreshBalanceC2S}
     */
    this.refreshBalanceData = new SlotGameRefreshBalanceC2S();
    /**
     * @type {SlotGameRegisterForOnlineGameC2S}
     */
    this.registerData = new SlotGameRegisterForOnlineGameC2S();

    this._initStops(this.ctx);
  }

  _onOffline() {
    if (this.onDisconnected) {
      this.ctx.retCode = this.ctx.TXT.ERR_COMM_LOST_CODE;
      this.onDisconnected(this.ctx.TXT.ERR_COMM_LOST_CODE);
    }
  }

  start(onConnected, onDisconnected) {
    const ctx = this.ctx;

    this.onConnected    = onConnected;
    this.onDisconnected = onDisconnected;

    this.registerData.token      = ctx.token;
    this.registerData.operatorId = ctx.BACKEND.OPERATOR_ID.toString();
    this.registerData.gameId     = ctx.GAME.ID;
    this.registerData.operator   = 'BlackFox';

    window.addEventListener('offline', () => this._onOffline(), false);

    this._post(CMD.REGISTER, this.registerData, (result) => this._onGameRegister(result));
  }

  stop() {
  }

  _onGameRegister(result) {
    console.log('Game Server Connected');
    const ctx        = this.ctx;
    this.isConnected = true;
    this.aspectUid   = result.sessionId;

    ctx.rtp             = result.baseGame.rtp;
    ctx.reelStrips      = result.reelStrip;
    ctx.betRule         = Utils.stringToArray(result.perLineRule, ',', true);
    ctx.maxGambleRounds = result.maxGambleRounds;

    if (result.player.currency) {
      ctx.currency = result.player.currency;
    }

    if (result.player.currencyPrecision !== undefined) {
      ctx.currencyPrecision = result.player.currencyPrecision;
    }

    if (result.player.exchangeRate) {
      ctx.exchangeRate = result.player.exchangeRate;
    }

    ctx.gambleOn = ctx.maxGambleRounds > 0;

    if (result.stateData && (result.stateData !== '{}')) {
      try {
        ctx.stateData = JSON.parse(result.stateData);
        console.log('Game State Data:', ctx.stateData);
      } catch (e) {
        console.error('Wrong Game State Data:', result.stateData);
      }
    }

    this._updateContext(result, null, CMD.REGISTER);

    if (ctx.gameState === STATE.GAME_IDLE) {
      ctx.betPerLine = result.defaultBet;
    }

    Utils.currency          = ctx.currency;
    Utils.currencyPrecision = ctx.currencyPrecision;
    Utils.exchangeRate      = ctx.exchangeRate;

    this.onConnected();
  }

  playBaseGame(onResult, options) {
    const remark = {};

    if (this.ctx.UI.NUM_PAYLINES_CHANGEABLE) {
      remark.line = this.ctx.lines;
    }

    remark.bet = this.ctx.betPerLine;

    if (options) {
      remark.emulation = true;
      remark.options   = options; // sample: 'main.stops=12,12,12,1,2,3,4,1,6,7,8,9,10,11';
    }

    this.gamePlayData.remark = remark;

    this._send(CMD.GAME_PLAY, this.gamePlayData, onResult);
  }

  playFreeGame(onResult, options) {
    const remark = {};

    if (options) {
      remark.emulation = true;
      remark.options   = options; // sample: 'main.stops=12,12,12,1,2,3,4,1,6,7,8,9,10,11';
    }

    this.freePlayData.remark = remark;

    this._send(CMD.FREE_GAME_PLAY, this.freePlayData, onResult);
  }

  enterFreeGame(onResult) {
    this._send(CMD.FREE_GAME_INTRO, this.freeIntroData, () => {
      if (onResult) onResult();
    });
  }

  exitFreeGame(onResult) {
    this._send(CMD.FREE_GAME_OUTRO, this.freeOutroData, () => {
      if (onResult) onResult();
    });
  }

  enterGambleGame(onResult) {
    this._send(CMD.GAMBLE_GAME, this.gambleGameData, onResult);
  }

  playGambleGame(onResult) {
    const gamble = this.ctx.gamble;

    this.gambleSelectData.remark = {
      selection: gamble.gambleSelection
    };

    this._send(CMD.GAMBLE_SELECT, this.gambleSelectData, onResult);
  }

  endGame(onResult) {
    this._send(CMD.GAME_END, this.endGameData, onResult);
  }

  endBaseGame(onResult) {
    this.ctx.lastAccumWin = 0;
    this.ctx.gameState    = STATE.GAME_IDLE;
    if (onResult) {
      onResult();
    }
  }

  /**
   * @param {number} pickValue
   * @param {function} onResult
   */
  pickBonus(pickValue, onResult) {
    this.bonusSelectData.remark = {
      selectBonus: pickValue,
    };

    this._send(CMD.BONUS_SELECT, this.bonusSelectData, onResult);
  }

  /**
   * @param {function} onResult
   */
  exitBonus(onResult) {
    this._send(CMD.BONUS_OUTRO, this.bonusOutroData, onResult);
  }

  refreshBalance() {
    this._post(CMD.REFRESH_BALANCE, this.refreshBalanceData, (result) => {
      console.log('Update balance');

      this.ctx.balance = result.totalCash;
      this.ctx.game.refreshMeters();
    });
  }

  _updateContext(result, onResult, command) {
    this._updateBaseGameContext(result.baseGame, command);

    if (result.object) {
      for (let i = 0, n = result.object.length; i < n; i++) {
        this._updateFeatureContext(result.object[i]);
      }
    }

    if (this.ctx.sounds) this.ctx.sounds.pickWinSoundAtRandom(this.ctx.win);
    if (onResult) onResult();
  }

  _initStops(game) {
    game.stops = this.ctx.MATH.DEFAULT_STOPS;

    // init 6th reel
    if (this.ctx.FEATURE.SIX_REELS) {
      game.SixthReelSymbol    = this.ctx.FEATURE.DEFAULT_SYMBOL;
      game.ExpandedReels      = 0;
      game.SixthReelCreditWin = 0;
      game.SixthReelStops     = this.ctx.FEATURE.DEFAULT_STOPS;
    }
  }

  _updateStops(game, data) {
    if (!data.stops) return this._initStops(game);

    // show default stops instead of last stops when loading the game in game idle
    if (!this.isConnected && this.ctx.gameState === STATE.GAME_IDLE) return this._initStops(game);

    game.stops = Utils.commaSeparatedStringToNumberArray(data.stops);
  }

  _updateWinLineInfo(game, data) {
    game.winLineInfo = [];
    for (let i = 0, n = data.winLineInfo.length; i < n; i++) {
      game.winLineInfo.push(new WinLine(this.ctx, game, data.winLineInfo[i]));
    }
  }

  /**
   * parse scatterInfo data for scatters winShow
   * @param {Object} game - this.context or this.context.freeGame
   * @param {Object} data - BaseGame data from server
   */
  _updateScatterInfo(game, data) {
    if (!data.scatterInfo) {
      game.scatterInfo = null;
    } else {
      const info = new WinLine(this.ctx, game, data.scatterInfo);

      // filter invalid scatter information
      if (info.isValid) {
        game.scatterInfo = info;
      } else {
        game.scatterInfo = null;
      }
    }
  }

  _updateFeatureContext(data) {
    if (!data || !data.objName) return;

    switch (data.objName) {
      case 'freeGame':
        this._updateFreeGameContext(data);
        break;
      case 'gambleGame':
        this._parseGambleData(this.ctx.gamble, data);
        break;
      case 'bonusGame':
        this._parseBonusData(this.ctx.bonus, data);
        break;
      default:
        break;
    }
  }

  _updateBaseGameContext(data, command) {
    const ctx = this.ctx;

    ctx.gameState    = data.gameState;
    ctx.balance      = data.totalCash;
    ctx.baseGameWon  = data.baseGameWon;
    ctx.freeSpinsWon = data.freeSpinsWon; // number of free spins won
    if (data.winLossHistory) {
      ctx.winLossHistory = data.winLossHistory.reverse();
    } else {
      ctx.winLossHistory = [];
    }

    if (command !== CMD.GAME_END) {
      ctx.lines      = data.line;
      ctx.betPerLine = data.bet;
      ctx.totalBet   = data.totalWager;
    }

    this._updateStops(ctx, data);
    this._updateScatterInfo(ctx, data);
    this._updateWinLineInfo(ctx, data);

    ctx.lastAccumWin = data.lastAccumWin;

    this._parseMathParams(ctx, data.mathSpecificParams);
    this._parseSingleResults(ctx, data.singleResult);
  }

  _parseSingleResults(ctx, results) {
    ctx.singleResult = results;
  }

  _parseBonusData(bonus, data) {
    bonus.complete           = data.complete;
    bonus.numPicks           = data.numPicks;
    bonus.maxSelectableBonus = data.maxSelectableBonus;
    bonus.win                = data.win;
    bonus.numFreeGamesWon    = data.numFreeGamesWon;
    bonus.multiplier         = data.multiplier;
    bonus.mask               = data.mask;
    bonus.values             = data.values;
  }

  _parseGambleData(gamble, data) {
    gamble.gambleCradDraw        = data.gambleCradDraw;
    gamble.gambleSelection       = data.gambleSelection;
    gamble.gambleWager           = data.gambleWager;
    gamble.gambleWon             = data.gambleWon;
    gamble.currentGambleIndex    = data.currentGambleIndex;
    gamble.gambleCardDrawHistory = data.gambleCardDrawHistory;
  }

  _updateFreeGameContext(data) {
    const ctx  = this.ctx;
    const free = {};

    free.totalWager           = data.totalWager;
    free.freeGameWon          = data.freeGameWon;         //credits free spin won
    free.totalFreeGameWon     = data.totalFreeGameWon;
    free.totalFreeGameIndex   = data.totalFreeGameIndex;
    free.currentFreeGameIndex = data.currentFreeGameIndex;
    free.freeSpinsWon         = data.freeSpinsWon;         // number spins of free spins won for retrigger

    this._updateStops(free, data);
    this._updateScatterInfo(free, data);
    this._updateWinLineInfo(free, data);

    ctx.freeGame = free;

    this._parseMathParams(free, data.mathSpecificParams);
    this._parseSingleResults(free, data.singleResult);
  }

  _parseMathParams(game, params) {
    if (params) {
      // show default stops instead of last stops when loading the game in game idle
      if (!this.isConnected && this.ctx.gameState === STATE.GAME_IDLE) return this._initStops(game);
      game.mathSpecificParams = params;

      // for maths with 6th reel
      if (this.ctx.FEATURE.SIX_REELS) {
        game.SixthReelSymbol    = parseInt(params.SixthReelSymbol);
        game.ExpandedReels      = parseInt(params.ExpandedReels);
        game.SixthReelCreditWin = parseInt(params.SixthReelCreditWin);
        game.SixthReelStops     = Utils.spaceSeparatedStringToNumberArray(params.SixthReelStops);
      }

      if (params.NextFreeGameStickyWildMask) {
        this._parseStickyWild(game, params.NextFreeGameStickyWildMask);
      }
    }
  }

  /**
   * for stickyWild game
   * @param game ctx or ctx.freeGame
   * @param NextFreeGameStickyWildMask
   */
  _parseStickyWild(game, NextFreeGameStickyWildMask) {
    let wildMap       = parseInt(NextFreeGameStickyWildMask).toString(2);
    let stickyWildAry = wildMap.split('').reverse();
    let stickyWildPos = [];

    for (let i = 0, len = stickyWildAry.length; i < len; i++) {
      if (stickyWildAry[i] === '1') {
        stickyWildPos.push(i);
      }
    }

    game.NextFreeGameStickyWildMask = wildMap;
    game.stickyWildPos              = stickyWildPos;
  }

  _send(cmd, data, onResult) {
    this._post(cmd, data, (result) => this._updateContext(result, onResult, cmd));
  }

  /**
   * @param {string} cmd
   * @param {object} data
   * @param {function} onResult
   * @private
   */
  _post(cmd, data, onResult) {
    if (this.ctx.stateData) {
      data.stateData = JSON.stringify(this.ctx.stateData);
    } else {
      data.stateData = '';
    }

    const json = JSON.stringify(data);

    console.log('[Sending:' + cmd + ']', json);
    let outTime;
    if (this.ctx.game.gameLoaded) {
      outTime = 15000;
    } else {
      outTime = 68000;
    }

    $.ajax({
      cache:       false, // prevent Ajax request from caching in IE
      url:         this._getURL(cmd),
      timeout:     outTime,
      data:        json,
      type:        'POST',
      dataType:    'json',
      contentType: 'text/plain; charset=utf-8', // use "text/plain" instead of "application/json" to avoid become preflighted requests
      success:     (result) => {
        // console.log('[Received:' + cmd + ']', JSON.stringify(result, null, 4));
        console.log('[Received:' + cmd + ']', JSON.stringify(result));
        if (result.retCode === 0) {
          this.ctx.retCode = result.retCode;
          onResult(result);
        } else {
          this.ctx.retCode = result.retCode;
          this.onDisconnected(result.retCode);
        }
      },
      error:       (jqXHR, textStatus, errorThrown) => {
        console.log('Error: ' + errorThrown);
        if (errorThrown === 'timeout') {
          this.ctx.retCode = this.ctx.TXT.ERR_COMM_LOST_CODE;
          this.onDisconnected(this.ctx.TXT.ERR_COMM_LOST_CODE);
        } else {
          this.onDisconnected();
        }
      }
    });
  }

  _getURL(cmd) {
    let url = this.ctx.BACKEND.HOST + '/gameserver/jsonmessage?rpc=' + cmd;
    url += '&aspectUid=' + (this.aspectUid ? this.aspectUid : '');
    // url += '&logSessionId=' + (this.logSessionId ? this.logSessionId : '');
    // url += '&r=' + Math.random(); // RNG maybe used to avoid caching, useless now since we have set cache to false in ajax.
    return url;
  }
}
