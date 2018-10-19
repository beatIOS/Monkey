/**
 * @class System
 * @author ligang.yao
 */
export class System {
  /**
   * Disable mouse middle wheel to prevent scrolling and zooming
   * @see {@link http://snipplr.com/view/111597/javascript-disable--enabling--mouse-wheel}
   */
  static disableMouseWheel() {
    const disableWheel = (e) => {
      e = e || window.event; // IE7, IE8, Chrome, Safari
      if (e.preventDefault) e.preventDefault(); // Chrome, Safari, Firefox
      e.returnValue = false; // IE7, IE8
    };

    if (document.addEventListener) {
      document.addEventListener('DOMMouseScroll', disableWheel, false);
    } // Chrome, Safari, Firefox

    if (!System.getSupportPassiveOptionBool()) {
      document.onmousewheel = disableWheel; // IE7, IE8
    }
  }

  static getUrlParams() {
    const params = {};
    decodeURIComponent(window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/g, (m, key, value) => params[key] = value);
    return params;
  }

  /**
   * Detects support for the passive option to addEventListener.
   * **/
  static getSupportPassiveOptionBool() {
    if (System.isSupportsPassiveOption !== undefined) {
      return System.isSupportsPassiveOption;
    }
    System.isSupportsPassiveOption = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: function () {
          System.isSupportsPassiveOption = true;
        }
      });
      window.addEventListener('test', null, opts);
// eslint-disable-next-line no-empty
    } catch (e) {
    }
    return System.isSupportsPassiveOption;
  }
}