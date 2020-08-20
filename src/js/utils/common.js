import * as constants from '../services/constants';
import * as bowser from 'bowser'
import * as web3Package from "../services/web3";
import * as validators from "../utils/validators";

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function getActiveLanguage(langs) {
  for (var i = 0; i < langs.length; i++) {
    if (langs[i].active) {
      return langs[i].code
    }
  }
  return "en"
}


export function getPath(path, listParams) {
  var index = 0
  listParams.map(param => {
    var value = getParameterByName(param.key)
    if (!value) return

    if (value === param.default) return

    if (index === 0) {
      path += `?${param.key}=${value}`
      index++
      return
    }

    path += `&${param.key}=${value}`
  })
  return path
}


export var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

export var checkBrowser = {
  isFirefox: function () {
    return !!bowser.firefox
  },
  isChrome: function () {
    return !!bowser.chrome
  },
  isSafari: function () {
    return !!bowser.safari
  },
  isNotFCSBrowser: function () {
    return !this.isFirefox && !this.isChrome && !this.isSafari;
  }
}

export function isAtSwapPage(path) {
  const regex = /^\/swap\//;
  return regex.test(path);
}


export function getTokenPairFromRoute(path) {
  const regex = /^\/swap\/(\w+)-(\w+)/;
  const match = regex.exec(path);
  return {
    sourceTokenSymbol: match[1],
    destTokenSymbol: match[2]
  }
}

export function getAssetUrl(uri = "") {
  return constants.ASSET_URL + uri.toLowerCase();
}


export function isUserEurope() {
  var isEurope = getCookie("is_europe")
  return isEurope === true || isEurope === 'true'
}

export function setCookie(cname, cvalue, exdays) {
  if (!exdays) {
    exdays = 5 * 365
  }
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}


export function getTokenBySymbol(tokens, symbol) {
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].symbol === symbol) {
      return tokens[i]
    }
  }
  return false
}


export function addScriptTag(src) {
  var script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.body.appendChild(script);
}

export function getFormattedDate(value, isNumberForm = false) {
  let date = value;
  if (typeof value === "number") {
    date = new Date(value * 1000);
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  if (isNumberForm) {
    return `${year}${date.getMonth()}${day}`;
  }
  return `${day} ${month} ${year}`;
}


export function isUserLogin() {
  //dummy data
  if (process.env && process.env.integrate) {
    var loginCookies = getCookie("signed_in")
    return loginCookies === true || loginCookies === "true" ? true : false
  }
  return true
}

export function formatFractionalValue(input, decimal) {
  let value = input;
  if (typeof value === "number") {
    value = value + "";
  }
  if (decimal <= 0) return value;

  const arr = value.split(".");
  if (arr.length > 1) {
    if (arr[1].length > decimal) {
      return `${arr[0]}.${arr[1].slice(0, decimal)}`
    }
  }
  return value;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function findTokenBySymbol(tokens, symbol) {
  return tokens.find(token => {
    return token.symbol === symbol;
  });
};

export function calcInterval(selectedTimeFilter) {
  let { interval, unit } = selectedTimeFilter;
  if (unit === "day") {
    interval = interval * 86400;
  } else if (unit === "week") {
    interval = interval * 604800;
  } else if (unit === "month") {
    interval = interval * 2629743;
  }
  return interval;
}

export function getNowTimeStamp() {
  return Math.round(new Date().getTime() / 1000);
}

let closeModalExecutors = []

export function addCloseModalExecutors(f) {
  if (closeModalExecutors.indexOf(f) == -1) {
    closeModalExecutors.push(f)
  }
}

export function removeCloseModalExecutors(f) {
  const index = closeModalExecutors.indexOf(f)
  if (index > -1) {
    closeModalExecutors.splice(index, 1);
  }
}

export function clearCloseModalExecutors() {
  closeModalExecutors = []
}

export function getCloseModalExecutors() {
  return closeModalExecutors
}

export function getReferAddress(accountType) {
  if (accountType === "metamask") {
    const web3Service = web3Package.newWeb3Instance();
    return web3Service.getWalletId();
  }

  const refAddr = getParameterByName("ref");
  if (!validators.verifyAccount(refAddr)) {
    return refAddr
  }

  return constants.EXCHANGE_CONFIG.COMMISSION_ADDR;
}

export function calculateFeeByWalletId(platformFee, accountType) {
  const walletId = getReferAddress(accountType);
  let fee = constants.DEFAULT_BPS_FEE;

  if (+platformFee === 0 || walletId === constants.EXCHANGE_CONFIG.COMMISSION_ADDR) {
    fee = platformFee;
  }

  return fee;
}
