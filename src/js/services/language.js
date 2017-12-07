import localForage from 'localforage'
import  constants from "./constants"
import Language from "../../../lang"

export default class LanguageService {
  constructor(isClientLoad, store){
    super(isClientLoad, store)
    this.isClientLoad = isClientLoad
    this.store = store
    this.initLanguage(isClientLoad)
  }

  initLanguage(isClientLoad){
    const defaultLanguagePack = require("../../lang/" + Language.defaultLanguage + ".json")
    const arrayLangInit = Language.loadAll? Language.supportLanguage : Language.defaultAndActive 
    this.store.dispatch(initialize(arrayLangInit, { 
      missingTranslationCallback: onMissingTranslation, 
      showMissingTranslationMsg: false,
      // defaultLanguage: Language.defaultLanguage
    }));
    this.store.dispatch(addTranslationForLanguage(defaultLanguagePack, Language.defaultLanguage));

    if(Language.loadAll){
      Language.otherLang.map((langName) => {
        try{
          let langData = require("../../lang/" + langName + ".json")
          this.store.dispatch(addTranslationForLanguage(langData, langName));
        }catch(err){
          console.log(err)
        }
      })
    }
  }

  getLanguage(key){

  }
}