
import BaseProvider from "./BaseProvider"

export default class PruneProvider extends BaseProvider {
    constructor(props) {
        super(props)
        this.rpcUrl = props.url
        this.initContract()
    }
}
