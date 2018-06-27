
import React from 'react';

import * as providers from "./notiProviders"

export default class NotiService extends React.Component {
  constructor(props) {
    super(props)

    const MAX_SAVE_NOTI = 10
    switch(props.type){
      case "localStorage":
        this.provider = new providers.LocalStorageNoti({maxNoti: MAX_SAVE_NOTI})
        break
      case "session":
        this.provider = new providers.SessionNoti({maxNoti: MAX_SAVE_NOTI})
        break
      default:
        this.provider = new providers.LocalStorageNoti({maxNoti: MAX_SAVE_NOTI})
        break
    }
  }
  callFunc(fn, ...args) {
    this.provider[fn](...args)
  }
}