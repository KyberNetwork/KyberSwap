import React from "react"
export default class QuoteList extends React.Component{
  render() {
    const { currentQuote, quotes, onClick } = this.props
    return (
      <div id="quote_panel">
        { quotes.map(i => {
            if (i == "FAV"){
              return <div key={i} className={currentQuote == i  ? "star active" : "star" } onClick={() => onClick(i)} ></div>
            }else {
              return <span key={i} className={currentQuote == i ? "active" :""} onClick={() => onClick(i)}>{i}</span>
            }
          })
        }
      </div>
    )
  }
}