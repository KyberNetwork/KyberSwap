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
    const {text, isActive, Wrapper, showArrow} = this.props;
    const sortDirectionClass = showArrow === undefined || showArrow ? this.state.isDsc ? "dsc" : "asc" : '';

    return (
      <Wrapper
        width={this.props.width}
        onClick={this.onClick}
        className={`theme__sort ${isActive ? "active" : ''} ${sortDirectionClass}`}
      >
        {text} 
      </Wrapper>
    )
  } 
}
