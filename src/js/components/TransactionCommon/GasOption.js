import React from "react"
import { Selector } from "../../containers/CommonElements"

export default class GasOption extends React.Component {
    changeGas = (value) => {
        this.props.onChange(value);
    }
    render() {
        return (
            <div className="gas-option">
                <Selector
                    defaultItem={this.props.focus}
                    listItem={this.props.gasOptions}
                    onChange = {this.changeGas}
                />
            </div>
        )
    }
}

