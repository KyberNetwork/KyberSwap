import React from 'react';
import Mixpanel from "./mixpanel"

export default class AnalyticFactory extends React.Component{
  constructor(props) {
    super(props)
    this.network = props.network

    var listWorker = props.listWorker
    this.initWorker(listWorker)
  }

  initWorker (listWorker){
    this.workers = []
    listWorker.map(worker => {
      switch(worker){
        case "mix":
          var instanceWorker = new Mixpanel()
          instanceWorker.initService(this.network)
          this.workers.push(instanceWorker)
          break
        default:
          var instanceWorker = new Mixpanel()
          instanceWorker.initService(this.network)
          this.workers.push(instanceWorker)
          break
      }
    })
  }

  callTrack = (funcName, ...args) => {
    for (var i = 0; i< this.workers.length; i++){
      this.workers[i][funcName](...args)
    }
  }
}
