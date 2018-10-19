import {Utils} from '../Utils';
import {STATE} from '../State';
import {CMD} from './SocketCommand.js';
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

/**
 * @class SocketController
 * @author ligang.yao
 */
export class SocketController {

  constructor(ctx) {
    this.ctx = ctx;

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

    this._isWaitingResponse = false;

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

    this.registerData.gameId = ctx.GAME.ID;

    this._requestMessage = {
      platform:    {
        'gameId':       ctx.GAME.ID,
        'username':     ctx.BACKEND.TEST_ACCOUNT,
        'operatorId':   ctx.BACKEND.OPERATOR_ID,
        'providerId':   ctx.BACKEND.GAME_PROVIDER,
        'sessionToken': ctx.token
      },
      publicState: {}
    };

    window.addEventListener('offline', () => this._onOffline(), false);

    this.ws = new WebSocket(this.ctx.BACKEND.HOST);

    this.ws.addEventListener('open', () => {
      console.log('Game Server Connected');

      this._send(CMD.REGISTER, this.registerData);
    });

    this.ws.addEventListener('message', (msg) => this._onResponse(msg));
    this.ws.addEventListener('error', () => this._onOffline(), false);
    this.ws.addEventListener('close', () => this._onOffline(), false);
  }

  stop() {
    this.ws.close();
    this.ws = null;
  }

  _onGameRegister(result) {
    console.log('Game Server Connected');
    const ctx           = this.ctx;
    const cfg           = result.slotConfig;
    this.isConnected    = true;
    ctx.rtp             = cfg.rtp;
    ctx.reelStrips      = cfg.reelStrips;
    ctx.betRule         = Utils.stringToArray(cfg.betMultiplierSelections, ',', true);
    ctx.maxGambleRounds = cfg.maxGambleRounds;

    if (cfg.currency) {
      ctx.currency = cfg.currency;
    }

    if (cfg.currencyPrecision !== undefined) {
      ctx.currencyPrecision = cfg.currencyPrecision;
    }

    if (cfg.exchangeRate) {
      ctx.exchangeRate = cfg.exchangeRate;
    }

    ctx.gambleOn = ctx.maxGambleRounds > 0;

    if (cfg.stateData && (cfg.stateData !== '{}')) {
      try {
        ctx.stateData = JSON.parse(cfg.stateData);
        console.log('Game State Data:', ctx.stateData);
      } catch (e) {
        console.error('Wrong Game State Data:', cfg.stateData);
      }
    }

    this._updateContext(result, null, CMD.REGISTER);

    if (ctx.gameState === STATE.GAME_IDLE) {
      ctx.betPerLine = cfg.defaultBetMultiplier;
    }

    Utils.currency          = ctx.currency;
    Utils.currencyPrecision = ctx.currencyPrecision;
    Utils.exchangeRate      = ctx.exchangeRate;

    this.onConnected();
  }

  playBaseGame(onResult, options) {
    const remark = {};

    remark.betMultiplier = this.ctx.betPerLine;

    if (options) {
      remark.emulation = options; // sample: 'main.stops=12,12,12,1,2,3,4,1,6,7,8,9,10,11';
    }

    this.gamePlayData = remark;

    this._send(CMD.GAME_PLAY, this.gamePlayData, onResult);
  }

  playFreeGame(onResult, options) {
    const remark = {};

    if (options) {
      remark.emulation = options; // sample: 'main.stops=12,12,12,1,2,3,4,1,6,7,8,9,10,11';
    }

    this.freePlayData = remark;

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

    this.gambleSelectData = {
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
    this.bonusSelectData = {
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
    this._send(CMD.REFRESH_BALANCE, this.refreshBalanceData, () => {
      console.log('Update balance');
      this.ctx.game.refreshMeters();
    });
  }

  _updateContext(result, onResult, command) {
    const ctx = this.ctx;

    ctx.gameState    = result.state;
    ctx.lastAccumWin = result.totalWin;

    if (command !== CMD.GAME_END) {
      ctx.lines      = result.currentPaylines;
      ctx.betPerLine = result.currentBetMultiplier;
      ctx.totalBet   = result.totalWager;
    }

    this._updateBaseGameContext(result.baseGame);

    if (result.freeGame) {
      this._updateFreeGameContext(result.freeGame);
    }
    if (result.gambleGame) {
      this._parseGambleData(this.ctx.gamble, result.gambleGame);
    }
    if (result.bonusGame) {
      this._parseBonusData(this.ctx.bonus, result.bonusGame);
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
    if (!data.reelStops) return this._initStops(game);

    // show default stops instead of last stops when loading the game in game idle
    if (!this.isConnected && this.ctx.gameState === STATE.GAME_IDLE) return this._initStops(game);

    game.stops = Utils.commaSeparatedStringToNumberArray(data.reelStops);
  }

  _updateWinLineInfo(game, data) {
    game.winLineInfo = [];
    game.scatterInfo = null;

    if (data.winLines) {
      for (let i = 0, n = data.winLines.length; i < n; i++) {
        const info = new WinLine(this.ctx, game, data.winLines[i]);

        if (info.line < 0) {
          if (info.isValid) {
            game.scatterInfo = info;
          }
        } else {
          game.winLineInfo.push(info);
        }
      }
    }
  }

  _updateBaseGameContext(data) {
    const ctx = this.ctx;

    ctx.baseGameWon  = data.baseGameWin;
    ctx.freeSpinsWon = data.numFreeSpinsWon; // number of free spins won
    if (data.winLossHistory) {
      ctx.winLossHistory = data.winLossHistory.reverse();
    } else {
      ctx.winLossHistory = [];
    }

    this._updateStops(ctx, data);
    this._updateWinLineInfo(ctx, data);

    this._parseMathParams(ctx, data.featureParams);
    this._parseSingleResults(ctx, data.singleResult);
  }

  _parseSingleResults(ctx, results) {
    ctx.singleResult = results;
  }

  _parseBonusData(bonus, data) {
    bonus.complete           = data.complete;
    bonus.numPicks           = data.numSelections;
    bonus.maxSelectableBonus = data.maxSelectableBonus;
    bonus.win                = data.bonusGameWin;
    bonus.numFreeGamesWon    = data.numFreeSpinsWon;
    bonus.multiplier         = data.multiplier;
    bonus.mask               = data.selectionMask;
    bonus.values             = data.values;
  }

  _parseGambleData(gamble, data) {
    gamble.currentGambleIndex    = data.currentGambleIndex;
    gamble.gambleSelection       = data.gambleSelection;
    gamble.gambleCradDraw        = data.gambleResult;
    gamble.gambleWager           = data.gambleWager;
    gamble.gambleWon             = data.gambleWin > 0;
    gamble.gambleCardDrawHistory = data.gambleHistory;
  }

  _updateFreeGameContext(data) {
    const ctx  = this.ctx;
    const free = {};

    free.freeGameWon          = data.freeGameWin;         //credits free spin won
    free.totalFreeGameWon     = data.totalFreeGameWin;
    free.totalFreeGameIndex   = data.totalFreeGameIndex;
    free.currentFreeGameIndex = data.currentFreeGameIndex;
    free.freeSpinsWon         = data.numFreeSpinsWon;         // number spins of free spins won for retrigger

    this._updateStops(free, data);
    this._updateWinLineInfo(free, data);

    ctx.freeGame = free;

    this._parseMathParams(free, data.featureParams);
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

  _send(type, body, onResult) {
    if (this._isWaitingResponse) {
      console.warn('Ignore request while waiting for response: ' + type);
      return;
    }

    this._isWaitingResponse = true;
    this._onResult          = onResult;

    const data = {type: type};

    if (body) {
      if (type !== CMD.REGISTER && this.ctx.stateData) {
        body.stateData = JSON.stringify(this.ctx.stateData);
      }
      data.body = body;
    } else {
      if (this.ctx.stateData) {
        data.body = {stateData: JSON.stringify(this.ctx.stateData)};
      }
    }

    this._requestMessage.publicState = data;

    const json = JSON.stringify(this._requestMessage);
    console.log('[sending]: ', json);
    this.ws.send(json);
  }

  _onResponse(msg) {
    this._isWaitingResponse = false;
    const onResult          = this._onResult;
    this._onResult          = null;

    console.log('[received]: ', msg.data);

    this._responseMessage = JSON.parse(msg.data);

    // handling gameiom error
    const error = this._responseMessage.error;
    if (error && error.code) {
      switch(error.code) {
        case 2003:
        case 2007:
          this.ctx.retCode = this.ctx.TXT.ERR_NO_PLAYER_CODE;
          break;
        default:
          this.ctx.retCode = this.ctx.TXT.ERR_UNKNOWN_CODE;
          break;
      }
      this.onDisconnected(this.ctx.retCode);
      return;
    }

    const platform = this._responseMessage.platform;
    if (platform) {
      this.ctx.balance = platform.balance * 100;

      if (platform.message && platform.message.code === 2) {
        this.ctx.retCode = this.ctx.TXT.ERR_MULTIPLEUSERSLOGIN_CODE;
        this.onDisconnected(this.ctx.retCode);
        return;
      }else if(platform.message && platform.message.code === 1){
        this.ctx.retCode = this.ctx.TXT.ERR_COMM_LOST_CODE;
        this.onDisconnected(this.ctx.retCode);
        return;
      }
    }

    const res = this._responseMessage.publicState.body;
    const cmd = this._responseMessage.publicState.type;

    if (res.retCode !== 0) {
      this.ctx.retCode = res.retCode;
      this.onDisconnected(res.retCode);
      return;
    }

    switch (cmd) {
      case CMD.REGISTER:
        this._onGameRegister(res);
        break;
      case CMD.REFRESH_BALANCE:
        // no need to update context
        break;
      case CMD.GAME_PLAY:
      case CMD.GAME_END:
      case CMD.FREE_GAME_INTRO:
      case CMD.FREE_GAME_PLAY:
      case CMD.FREE_GAME_OUTRO:
      case CMD.BONUS_SELECT:
      case CMD.BONUS_OUTRO:
      case CMD.GAMBLE_GAME:
      case CMD.GAMBLE_SELECT:
      default:
        this._updateContext(res, onResult, cmd);
        break;
    }
  }
}
