import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux'
import { Currency, ManageColumn, MarketTable, SearchWord, SortColumn, TradingView } from "../Market"


@connect((store) => {

  return {
    translate: getTranslate(store.locale),
  }
})

export default class Market extends React.Component {

  render() {
    return (
      <div>
        <div>
          <div>
            <SearchWord />
            <Currency />
            <SortColumn />
          </div>
          <div>
            <ManageColumn />
          </div>
        </div>
        <div>
          <MarketTable />
        </div>
        <TradingView />
      </div>
    )
  }
}