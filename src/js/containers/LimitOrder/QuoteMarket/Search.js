import React from "react"
export default class Search extends React.Component{
  constructor() {
    super()
    this.state = { text: "" }
  }
  onChange = (e) => {
    const { onSearch } = this.props
    onSearch(e.target.value)
    this.setState({text: e.target.value})
  } 
  render(){
    return (
      <div id="search_panel">
        <input type="text"  className="theme__text-4 theme__background-55" value={this.state.text} onChange={this.onChange} />
      </div>
    )
  }
}