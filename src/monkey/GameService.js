import {HttpController} from './rest/HttpController.js';
import {SocketController} from './socket/SocketController.js';

/**
 * @class GameService
 * @author ligang.yao
 */
export class GameService {

  constructor(ctx) {
    if (ctx.BACKEND.HOST.startsWith('ws')) {
      this.controller = new SocketController(ctx);
    } else {
      this.controller = new HttpController(ctx);
    }
  }

  start(onConnected, onDisconnected) {
    this.controller.start(onConnected, onDisconnected);
  }

  stop() {
    this.controller.stop();
  }

  playBaseGame(onResult, options) {
    this.controller.playBaseGame(onResult, options);
  }

  playFreeGame(onResult, options) {
    this.controller.playFreeGame(onResult, options);
  }

  enterFreeGame(onResult) {
    this.controller.enterFreeGame(onResult);
  }

  exitFreeGame(onResult) {
    this.controller.exitFreeGame(onResult);
  }

  enterGambleGame(onResult) {
    this.controller.enterGambleGame(onResult);
  }

  playGambleGame(onResult) {
    this.controller.playGambleGame(onResult);
  }

  endGame(onResult) {
    this.controller.endGame(onResult);
  }

  endBaseGame(onResult) {
    this.controller.endBaseGame(onResult);
  }

  /**
   * @param {number} pickValue
   * @param {function} onResult
   */
  pickBonus(pickValue, onResult) {
    this.controller.pickBonus(pickValue, onResult);
  }

  /**
   * @param {function} onResult
   */
  exitBonus(onResult) {
    this.controller.exitBonus(onResult);
  }

  refreshBalance() {
    this.controller.refreshBalance();
  }

  get isConnected() {
    return this.controller.isConnected;
  }
}
