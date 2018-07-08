import  constants from "./constants"
import Language from "../../../lang/index"
import { initialize, addTranslation, addTranslationForLanguage, setActiveLanguage, localeReducer } from 'react-localize-redux';


const onMissingTranslation = (key, languageCode) => {
  // here you can do whatever you want e.g. call back end service that will 
  // console.log("-------------- missing transsaction")
  // console.log(key)
  // console.log(languageCode)
};



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
  // const defaultLanguagePack = require("../../../lang/" + Language.defaultLanguage + ".json")
  // const arrayLangInit = Language.loadAll? Language.supportLanguage : Language.defaultAndActive 

  // store.dispatch(initialize(arrayLangInit, { 
  //   missingTranslationCallback: onMissingTranslation, 
  //   showMissingTranslationMsg: false,
  //   defaultLanguage: Language.defaultLanguage
  // }));
  // store.dispatch(addTranslationForLanguage(defaultLanguagePack, Language.defaultLanguage));

  // if(Language.loadAll){
  //   Language.otherLang.map((langName) => {
  //     try{
  //       let langData = require("../../../lang/" + langName + ".json")
  //       store.dispatch(addTranslationForLanguage(langData, langName));
  //     }catch(err){
  //       console.log(err)
  //     }
  //   })
  // }

  let languagePack, packName
  try {
    packName = getParameterByName('lang')
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
  console.log("________________ load loanguage ", packName)
  store.dispatch(initialize([packName], { 
    missingTranslationCallback: onMissingTranslation, 
    showMissingTranslationMsg: false,
    defaultLanguage: packName
  }));
  store.dispatch(addTranslationForLanguage(languagePack, packName));

}

export function getLanguage(key){
  let langData = require("../../../lang/" + key + ".json")
  return langData
}
