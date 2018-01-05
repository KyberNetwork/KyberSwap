import  constants from "./constants"
import Language from "../../../lang/index"
import { initialize, addTranslation, addTranslationForLanguage, setActiveLanguage, localeReducer } from 'react-localize-redux';


const onMissingTranslation = (key, languageCode) => {
  // here you can do whatever you want e.g. call back end service that will 
  console.log("-------------- missing transsaction")
  console.log(key)
  console.log(languageCode)
};

export function initLanguage(store){
  const defaultLanguagePack = require("../../../lang/" + Language.defaultLanguage + ".json")
  const arrayLangInit = Language.loadAll? Language.supportLanguage : Language.defaultAndActive 

  store.dispatch(initialize(arrayLangInit, { 
    missingTranslationCallback: onMissingTranslation, 
    showMissingTranslationMsg: false,
    defaultLanguage: Language.defaultLanguage
  }));
  store.dispatch(addTranslationForLanguage(defaultLanguagePack, Language.defaultLanguage));

  if(Language.loadAll){
    Language.otherLang.map((langName) => {
      try{
        let langData = require("../../../lang/" + langName + ".json")
        store.dispatch(addTranslationForLanguage(langData, langName));
      }catch(err){
        console.log(err)
      }
    })
  }
}

export function getLanguage(key){
  let langData = require("../../../lang/" + key + ".json")
  return langData
}
