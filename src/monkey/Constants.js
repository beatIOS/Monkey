/**
 * @author ligang.yao
 */
export const ERR = {
  /** 操作成功 */
  ERR_CODE_OK: 0,
  /** 操作失败 */
  ERR_CODE_FAIL: 1,
  /** rmg平台不支持 */
  ERR_CODE_NOSUPPORT_ONLINE_GAME: 3,
  ERR_CODE_CONNECT_PLATFORM: 4,
  /** GAME模块ERR_CODE为 1xxx */
  ERR_CODE_NO_GAME: 1001,
  ERR_CODE_NO_PLAYER: 1002,
  /** SlotGame 输入bet或者line错误，不能转化为数字 */
  ERR_CODE_ERR_REMARK: 1011,
  /** 用户金额不够，不能扣除 */
  ERR_CODE_ERR_NOT_ENOUGH_AMOUNTS: 1014,
  /** TakeWin 状态不对 */
  ERR_CODE_TAKEWIN_GAMESTATE: 1016,
  /** 游戏不支持UnGamble */
  ERR_CODE_NONSUPPORT_UNGAMBLE: 1018,
  /** 游戏不支持UnGamble */
  ERR_CODE_SERVERAL_LOGIN_COUNT_ERROR: 1019,
  /** META模块ERR_CODE为 9xxx */
  ERR_CODE_META: 9001,
  /** META模块ERR_CODE为 9xxx */
  ERR_CODE_PAYMENT_BOUNS_ERROR: 7001,
  /** 参数报错 */
  ERR_ARGUMENT: 8001
};
