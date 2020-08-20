import Language from "../../../lang/index"
import { initialize, addTranslationForLanguage } from 'react-localize-redux';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function initLanguage(store){
  let languagePack, packName
  try {
    packName = getParameterByName('lang')
    if (packName === null) {
      var rawPackName = getParameterByName('locale')
      switch (rawPackName) {
        case "en-EN":
          packName = "en"
          break
        case "zh-CN":
          packName = "cn"
      }
    }
    if (packName){
      languagePack = require("../../../lang/" + packName + ".json")
    }else{
      packName = Language.defaultLanguage
      languagePack = require("../../../lang/" + packName + ".json")  
    }
  } catch (e) {
    console.log(e)
    packName = Language.defaultLanguage
    languagePack = require("../../../lang/" + packName + ".json")
  }

  store.dispatch(initialize({

    languages: [
      { name: "", code: packName },      
    ],
    options: {
      renderToStaticMarkup: false,
      renderInnerHtml: true
    }
  }))
  store.dispatch(addTranslationForLanguage(languagePack, packName));

}

export function getLanguage(key){
  let langData = require("../../../lang/" + key + ".json")
  return langData
}
