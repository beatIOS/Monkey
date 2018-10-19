/**
 * @class Utils
 * @author ligang.yao
 */
import {System} from './System';

export class Utils {

  static random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * get url parameter by name or url parameter object
   * @param {string} paramName Parameter name. if empty an object which contents all parameters will be returned
   * @returns {*}
   */
  static getUrlParam(paramName) {
    const params = {};
    decodeURIComponent(window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/g, (m, key, value) => params[key] = value);

    if (paramName) {
      return params[paramName];
    } else {
      return params;
    }
  }

  /**
   * check whether path/url ends with slash, or add slash in the end
   * @param path
   * @returns {*}
   */
  static pathSlash(path) {
    if (path && path !== '' && (path.charAt(path.length - 1) !== '/')) {
      path = path + '/';
    }
    return path;
  }

  /**
   * trim the left space and right space char in a string
   * @param {string} str String needs to trim
   * @returns {string|*|XML|void}
   */
  static trimString(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  static spaceSeparatedStringToNumberArray(str) {
    if (!str) return [];

    const temp = str.split(' ');
    for (let i = 0, n = temp.length; i < n; i++) {
      // must set parseInt() to use base 10 to avoid unexpected results with leading zeros ('001,002,003...').
      temp[i] = parseInt(temp[i], 10);
    }

    return temp;
  }

  static commaSeparatedStringToNumberArray(str) {
    // // According to experiments (Chrome) for 20 items, JSON.parse takes 60% time of above split => parseInt solution
    // return JSON.parse('[' + str + ']');

    if (!str) return [];

    const temp = str.split(',');
    for (let i = 0, n = temp.length; i < n; i++) {
      // must set parseInt() to use base 10 to avoid unexpected results with leading zeros ('001,002,003...').
      temp[i] = parseInt(temp[i], 10);
    }

    return temp;
  }

  /**
   * convert String to Array
   * @param str {string} string to convert.
   * @param separator {string} the separator in string, could be null or empty string.
   * @param isNumber {boolean} whether convert array item from String to Number.
   */
  static stringToArray(str, separator = ',', isNumber = false) {
    if (!str) return [];
    if (!separator) separator = '';
    const arr = str.split(separator);

    if (isNumber) {
      for (let i = 0, len = arr.length; i < len; i++) {
        arr[i] = Number(arr[i]);
      }
    }
    return arr;
  }

  /**
   * convert mask string from backend to Number array
   * @param maskStr
   * @returns {*}
   */
  static maskToArray(maskStr) {
    let ary = Utils.stringToArray(maskStr.toString(2), '', true);
    ary.reverse();
    return ary;
  }

  /**
   * filter duplicate elements for Array
   * @param arr Array needs to filter
   */
  static purifyArray(arr) {
    arr.filter(function (element, index, self) {
      return self.indexOf(element) === index;
    });
    console.log('purifyArray');
  }

  /**
   * turn currency string to currency symbol : USD -> $
   * @param {string} currencyName - 3 letter currency name, such as USD, GBP...
   */
  static currencySymbol(currencyName) {
    if (currencyName && currencyName !== '') {
      currencyName = currencyName.toUpperCase();
    }

    switch (currencyName) {
      case 'USD':
      case '$':
        return '$';
      case 'EUR':
      case '€':
        return '€';
      case 'GBP':
      case '£':
        return '£';
      default:
        return '';
    }
  }

  /**
   * parse cash amount from cents to accounting format string with currency symbol
   * @param {number} cents Amount of cents
   * @param {boolean} isInt Whether output with an integer (discards value after decimal point), default false to keep 2 decimal places
   * @returns {string} String likes 1,256.34 HKD or $1,256.00 ...
   */
  static formatCash(cents, isInt = false) {
    let cp             = Utils.currencyPrecision; // number of digits of fractional part
    let amount         = cents < 0 ? 0 : cents / Utils.exchangeRate;
    let currency       = Utils.currency;
    let currencySymbol = Utils.currencySymbol(currency);
    let moneyStr;

    if (isInt === true && amount >= 1) {
      moneyStr = Utils.accountFormat(amount, true);
    } else {
      if (cp && cp > 0) {
        moneyStr = Utils.accountFormat(amount, false);
      } else {
        moneyStr = Utils.accountFormat(amount, true);
      }
    }

    if (currencySymbol) {
      moneyStr = currencySymbol + moneyStr;
    } else {
      moneyStr = moneyStr + ' ' + currency;
    }

    return moneyStr;
  }

  static formatString(str, obj) {
    if (obj === '' || obj === undefined || obj === null) {
      return str;
    }
    else {
      for (let i of Object.keys(obj)) {
        let key   = '{' + i + '}';
        let index = str.indexOf(key);
        if (index !== -1) {
          str = str.replace(key, obj[i]);
        }
      }
      return str;
    }
  }

  /**
   * convert number to string in accounting format(example：1234 -> 1,234.00)
   * @param num {number} number needs to convert
   * @param isInt {boolean} whether display as int, default false to keep 2 decimal places
   * @returns {string}  return string in accounting format
   */
  static accountFormat(num, isInt = false) {
    let str        = num.toFixed(2);
    let len        = str.length;
    let charArray1 = [];
    let charArray2 = [];

    for (let i = len; i > 0; i--) {
      let char = str.substr(i - 1, 1);
      charArray1.push(char);
    }

    for (let i = 0; i < len; i++) {
      charArray2.push(charArray1[i]);
      if (i % 3 === 2 && (i > 3 && i !== len - 1)) {
        charArray2.push(',');
      }
    }

    charArray2 = charArray2.reverse();
    str        = charArray2.join('');
    str        = str.replace('-,', '-');
    if (isInt) {
      str = str.slice(0, str.length - 3);
    }

    return str;
  }

  /**
   *  @language
   *  @langConfig   configuration for language
   *  @isExact     whether or not exact for search
   *
   * */
  static getLanguage(language, langConfig, isExact) {
    if (language === undefined || language === null || language === '') return 'en-US';
    let list = langConfig;
    for (let languageKey of Object.keys(list)) {
      for (let languageValue of list[languageKey]) {
        if (languageValue.toLocaleLowerCase() === language.toLocaleLowerCase()) {
          return languageValue;
        }
      }
    }
    if (isExact) {
      language = 'en-US';
    } else {
      let langCode = language.slice(0, 2);
      let bool     = false;
      for (let languageValue of Object.keys(list)) {
        console.log('languageValue ' + languageValue);
        if (languageValue.toLocaleLowerCase() === langCode.toLocaleLowerCase()) {
          language = list[languageValue][0];
          bool     = true;
          break;
        }
      }
      if (bool === false) {
        language = 'en-US';
      }
    }
    return language;
  }

  /**
   *  used in loading page only while configuration.json is unavailable
   *  please keep it synchronized with Context.UI.LANGUAGES
   * **/
  static getLanguageConfig() {
    return {
      'en': ['en-US'],
      'ja': ['ja-JP'],
      'zh': ['zh-TW', 'zh-CN']
    };
  }

  /**
   * used in loading UI
   * @param key string name as 'LOADING'
   * @returns {*}
   */
  static getTextString(key) {
    const textTable = {
      'en-US': {
        'PREPARING': 'PREPARING',
        'TURN_YOUR_DEVICE': 'Please turn your device to landscape mode.',
        'LOADING': 'LOADING',
        'CONNECTING': 'CONNECTING'
      },
      'zh-CN': {
        'PREPARING': '游戏资源准备中',
        'TURN_YOUR_DEVICE': '请将您的手机转向横屏模式',
        'LOADING': '游戏加载中',
        'CONNECTING': '游戏连接中'
      },
      'zh-TW': {
        'PREPARING': '遊戲資源準備中',
        'TURN_YOUR_DEVICE': '請將您的手機轉向橫屏模式',
        'LOADING': '遊戲載入中',
        'CONNECTING': '遊戲連接中'
      },
      'ja-JP': {
        'PREPARING': '準備中',
        'TURN_YOUR_DEVICE': 'デバイスを横画面モードにしてください。',
        'LOADING': 'ロード',
        'CONNECTING': 'コネクト'
      }
    };
    let language    = Utils.getUrlParam('language');
    language        = Utils.getLanguage(language, Utils.getLanguageConfig());
    console.log('language ' + language);
    return textTable[language][key];
  }

  /**
   * symbol position ids in each reel
   * @param rowNum
   * @param reelNum
   */
  static posIdInReels(rowNum, reelNum) {
    const posInReels = [];

    for (let i = 0; i < reelNum; i++) {
      posInReels.push([]);
    }

    for (let i = 0; i < (rowNum * reelNum); i++) {
      let reelId = i % reelNum;
      posInReels[reelId].push(i);
    }
    return posInReels;
  }

  /**
   * symbol id in each reel
   * @param rowNum
   * @param reelNum
   * @param stops
   * @returns {Array}
   */
  static symbolIdInReels(rowNum, reelNum, stops) {
    stops.length = rowNum * reelNum;
    const matrix = [];

    for (let i = 0; i < reelNum; i++) {
      let reel = [];
      for (let j = 0; j < rowNum; j++) {
        reel.push(stops[j * reelNum + i]);
      }
      matrix.push(reel);
    }
    return matrix;
  }

}

export function addEvent(object, type, callback) {
  if (!object) return;

  if (object.addEventListener) {
    if (type === 'touchstart' || type === 'touchmove') {
      object.addEventListener(type, callback, System.getSupportPassiveOptionBool() ? {passive: true} : false);
    } else {
      object.addEventListener(type, callback, false);
    }
  } else if (object.attachEvent) {
    object.attachEvent('on' + type, callback);
  } else {
    object['on' + type] = callback;
  }
}

export function removeEvent(object, type, callback) {
  if (!object) return;

  if (object.addEventListener) {
    object.removeEventListener(type, callback);
  } else if (object.attachEvent) {
    object.detachEvent('on' + type, callback);
  } else {
    object['on' + type] = null;
  }
}
