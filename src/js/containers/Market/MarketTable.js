import React from "react"
import { connect } from "react-redux"

 
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    translate: getTranslate(store.locale),
  }
})

export default class MarketTable extends React.Component {

  render() {
    return <div>market table</div>
  }
}