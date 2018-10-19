/**
 * @class Text
 * @author cc.xu
 */
export class Text {
  constructor() {
    // all values may be overridden by res/{language}/text.json files
    this.WELCOME                        = 'WELCOME TO {gameName}';
    this.GOOD_LUCK                      = 'GOOD LUCK';
    this.PLAT_AGAIN                     = 'PLAY AGAIN';
    this.GET_3_MORE                     = 'GET 3 OR MORE {symbol} TO WIN FREE GAMES';
    this.FREE_GAME_WIN                  = 'FREE GAMES WIN {credit}';
    this.WINS                           = 'LINE {line} WINS {credit}';
    this.WINS_WAY                       = 'WINS {credit}';
    this.ALL_WIN                        = 'YOU WIN {credit}';
    this.SKIP_ANIMATION                 = 'Press "Esc" to Skip Animation';
    this.SCATTER_WIN                    = 'X{scatterNum} SCATTER WINS {credit}';
    this.SCATTER_WIN_FREE_GAMES         = 'X{scatterNum} SCATTER WINS {freeGamesNum} FREE GAMES';
    this.INCREASE_BALANCE_OR_CHANGE_BET = 'INCREASE YOUR BALANCE OR DECREASE BET PER LINE';
    this.INCREASE_BALANCE               = 'INCREASE YOUR BALANCE';
    this.INSUFFICIENT_BALANCE_CODE      = 'Insufficient Balance';
    this.INSUFFICIENT_BALANCE           = 'Insufficient Balance to Spin.';
    this.WOULD_YOU_LIKE_SOUND           = 'Would you like sound?';
    this.AUTOSPIN_TITLE                 = 'AUTOSPIN SETTINGS';
    this.AUTOSPIN_OPTION1               = 'Autospin';
    this.AUTOSPIN_OPTION2               = 'Stop if loss <br>exceeds';
    this.AUTOSPIN_OPTION3               = 'Stop if single <br>win exceeds';
    this.SETTINGS_BET                   = 'BET SETTINGS';
    this.SETTINGS_SOUND                 = 'SOUND SETTINGS';
    this.BET_MULTIPLIER                 = 'BET MULTIPLIER';
    this.BET_PER_LINE                   = 'BET PER LINE';
    this.GAME_SOUND                     = 'Game Sounds';
    this.WAYS                           = 'WAYS';
    this.LINES                          = 'LINES';
    this.SPINS                          = ' Spins';
    /**
     * ERR message description
     */
    this.ERR_MISSING_PARAMETER_CODE = 801;
    this.ERR_MISSING_PARAMETER         = 'Missing parameter in protocol.';
    this.ERR_UNKNOWN_PARAMETER_CODE    = 802;
    this.ERR_UNKNOWN_PARAMETER         = 'Unknown parameter in protocol.';
    this.ERR_VALUE_PARAMETER_CODE      = 803;
    this.ERR_VALUE_PARAMETER           = 'Parameter value is wrong.';
    this.ERR_UNKNOWN_CODE              = 1;
    this.ERR_UNKNOWN                   = 'Unknown error.';
    this.ERR_GAMEDISABLED_CODE         = 2;
    this.ERR_GAMEDISABLED              = 'The game is currently unavailable.';
    this.ERR_UNSUPPORTEDGAME_CODE      = 3;
    this.ERR_UNSUPPORTEDGAME           = 'The game ID is not available.';
    this.ERR_COMM_LOST_CODE            = 4;
    this.ERR_COMM_LOST                 = 'Server communications lost.';
    this.ERR_NO_PLAYER_CODE            = 202;
    this.ERR_NO_PLAYER                 = 'Unregistered players.';
    this.ERR_INCORRECT_OPERATOR_CODE   = 8005;
    this.ERR_INCORRECT_OPERATOR        = 'Incorrect Operator in protocol.';
    this.ERR_INCORRECT_LINES_CODE      = 8006;
    this.ERR_INCORRECT_LINES           = 'Incorrect number of lines in protocol.';
    this.ERR_INCORRECT_BETPERLINE_CODE = 8007;
    this.ERR_INCORRECT_BETPERLINE      = 'Incorrect bet per line amount in protocol.';
    this.ERR_INCORRECT_BET_CODE        = 8008;
    this.ERR_INCORRECT_BET             = 'Incorrect total bet amount in protocol.';
    this.ERR_INCORRECT_SELECTION_CODE  = 8009;
    this.ERR_INCORRECT_SELECTION       = 'Incorrect selection in protocol.';
    this.ERR_INCORRECT_WON_CODE        = 8010;
    this.ERR_INCORRECT_WON             = 'Incorrect win amount in protocol.';
    this.ERR_INSUFFICIENTFUNDS_CODE    = 1014;
    this.ERR_INSUFFICIENTFUNDS         = 'Insufficient balance to continue.';
    this.ERR_TIMEOUT_CODE              = 1015;
    this.ERR_TIMEOUT                   = '<p>You have been disconnected from the server.</p><p>Please click on OK to navigate to the game lobby.</p>';
    this.ERR_GAMBLE_LIMITS_CODE        = 1016;
    this.ERR_GAMBLE_LIMITS             = '<p>Gamble limits reached,</p><p>please click on OK to continue to play.</p>';
    this.ERR_FREE_LIMITS_CODE          = 1017;
    this.ERR_FREE_LIMITS               = '<p>Free limits reached,</p><p> please click on OK to continue to play.</p>';
    this.ERR_INVALID_SESSION_CODE      = 1018;
    this.ERR_INVALID_SESSION           = 'The session is invalid.';
    this.ERR_MULTIPLEUSERSLOGIN_CODE   = 1019;
    this.ERR_MULTIPLEUSERSLOGIN        = '<p>This account has been logged into from another device.</p> <p>Please click on OK to navigate to the game lobby.</p>';
    this.ERR_TAKEWIN_GAMESTATE_CODE    = 1026;
    this.ERR_TAKEWIN_GAMESTATE         = 'TakeWin failed,unexpected GameState.';
    this.ERR_UNEXPECTED_GAMESTATE_CODE = 1027;
    this.ERR_UNEXPECTED_GAMESTATE      = 'Unexpected GameState.';
    this.ERR_NONSUPPORT_UNGAMBLE_CODE  = 1028;
    this.ERR_NONSUPPORT_UNGAMBLE       = 'The game does not support gamble mode.';
    this.ERR_ACCOUNT_BLOCKED_CODE      = 2000;
    this.ERR_ACCOUNT_BLOCKED           = 'Your account is locked, please contact to customer service.';
  }
}
