import React from "react"
export default class SortableComponent extends React.Component {
  constructor() {
    super()
    this.state = { isDsc: true }
  }
  onClick = () => {
    const {onClick, isActive} = this.props
    onClick(isActive ? !this.state.isDsc : true)
    this.setState((state, props) => ({isDsc: (isActive ? !state.isDsc : true)}))
  }
  render() {
    // const { children, isEnable, Wrapper } = this.props
    const {text, isActive, Wrapper} = this.props
    const { isDsc } = this.state
    return (
      <Wrapper width={this.props.width} onClick={this.onClick} className={"theme__sort "+ (isActive ? ("active " + (isDsc ? "dsc" : "asc")) : "") }> 
        {text} 
      </Wrapper>
    )
  } 
}

