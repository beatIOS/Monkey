import {SlotGameBonusDTO} from './data/dto/SlotGameBonusDTO';
import {SlotGameGambleDTO} from './data/dto/SlotGameGambleDTO';
import {GAME_MODE} from './GameMode';
import {STATE} from './State';
import {Text} from './Text';

/**
 * Context and configurations for the whole game. Every DisplayObject has a reference to it.
 *
 * Capitalized properties are configurations.
 * This file contains default configurations which can be overridden at runtime by configuration.json files.
 *
 * @class Context
 * @author ligang.yao
 */
export class Context {

  constructor() {

    this.game = null;

    /**
     * @type {GAME_MODE}
     */
    this.gameMode = GAME_MODE.BASE_GAME;

    /**
     * @type {STATE}
     */
    this.gameState = STATE.GAME_IDLE;

    this.freeGame = null;

    /**
     * @type {SlotGameGambleDTO}
     */
    this.gamble = null;

    this.gambleOn = true; // set to true by default to load gamble graphics. will stop loading gamble graphics once gamble disabled during register.

    this.currencyPrecision = 2;

    this.exchangeRate = 100;

    /**
     * @type {SlotGameBonusDTO}
     */
    this.bonus = null;

    this.reelStrips = null;

    /**
     * @type {string}
     */
    this.token = null;

    /**\
     * State Data which will be saved in backend server
     * @type {Object|null}
     */
    this.stateData = null;

    // -------------------------- Game Configurations -------------------------
    this.GAME     = null;
    this.BACKEND  = null;
    this.MATH     = null;
    this.UI       = null;
    this.TXT      = null;
    this.PAYLINES = null;
    this.FEATURE  = null;

    this.initContextData();
    this.initConfigData();
  }

  initContextData() {
    this.gamble = new SlotGameGambleDTO();
    this.bonus  = new SlotGameBonusDTO();
  }

  initConfigData() {
    this.GAME = {
      ID:          0,
      NAME:        'Baseline',
      VERSION:     'v0.0.1',
      ART_VERSION: 'v0'
    };

    this.HOME_URL = 'http://www.aspectgaming.com/';

    this.BACKEND = {
      OPERATOR:        'BlackFox',
      OPERATOR_ID:     1,
      GAME_PROVIDER:   3,
      TEST_ACCOUNT:    'aspect_test7',
      TEST_TOKEN_HOST: 'qa-rgs.gameiom.com/rgs',
      DEMO_HOST:       'https://rmg-fun-test.aspectgaming.com',
      HOST:            'https://rmg-dev.aspectgaming.com'
      // HOST:            'wss://qa-rgs.gameiom.com/platform' // for socket solution, set this in configuration.json
    };

    this.EMULATION = {
      ENABLED:   true,
      FREE_GAME: 'main.stops=12,12,12,1,6,9,2,1,10,1,4,10,1,8,1,10,0,1,6,1'
    };

    // Values will be overridden by res/Configuration.json
    this.MATH = {
      DEFAULT_STOPS:    [12, 8, 6, 11, 5, 6, 10, 8, 1, 8, 7, 9, 7, 8, 9, 11, 8, 10, 9, 1],
      NUM_ALL_REELS:    5, // will be 6 if has 6th reel
      NUM_REELS:        5, // number of normal reels, still is 5 if has 6th special reel
      RETRIGGERABLE:    true,   //whether freeGame can re-trigger
      SCATTER_TRIGGER:  {BASE_GAME: 3, FREE_GAME: 3}, // At least how many scatters will trigger free games
      ADJACENT_SCATTER: false, // whether free games triggered by adjacent scatters from left most to right and started from reel0
      SCATTER_LOCATION: { // Which reels may have scatters
        BASE_GAME: [0, 1, 2, 3, 4],
        FREE_GAME: [0, 1, 2, 3, 4]
      },
      // only need to set wild, scatter and special symbols
      SYMBOL:           {WILD: 0, SCATTER: 12, SIZE: 13, NAMES: []}
    };

    this.TXT = new Text();

    this.FEATURE = {}; // for special features, such as 6th reel, defined in configuration.json file
  }

  getBetIndex(betPerLine) {
    return this.betRule.indexOf(betPerLine);
  }

  /**
   * @returns {string}
   */
  get TOKEN_TEST_URL() {
    return 'https://' + this.BACKEND.TEST_TOKEN_HOST + '/rest/authenticate/playerlogin?username=' + this.BACKEND.TEST_ACCOUNT + '&password=test&gameCode=' + this.GAME.ID;
  }

  /**
   * @param {number} totalBet
   */
  set totalBet(totalBet) {
    this._totalBet = totalBet;
  }

  /**
   * @returns {number}
   */
  get totalBet() {
    return this._totalBet;
  }

  /**
   * Current spinning win
   *
   * @returns {number}
   */
  get win() {
    return (this.gameMode === GAME_MODE.FREE_GAME) ? this.freeGame.freeGameWon : this.baseGameWon;
  }

}
