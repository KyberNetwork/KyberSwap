import React from "react";
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions";
import limitOrderServices from "../../services/limit_order";
import * as common from "../../utils/common";
const withFavorite = (Component) => {
    return connect((store, props) => {
        const favorite_pairs = store.limitOrder.listFavoritePairs;
        const favorite_pairs_anonymous = store.limitOrder.favorite_pairs_anonymous
        return {
            favorite_pairs, favorite_pairs_anonymous
        }
    })(class extends React.Component{

        onFavoriteClick = (base, quote, to_fav) => {
            if (common.isUserLogin()) {
                this.props.dispatch(limitOrderActions.updateFavorite(base, quote, to_fav, true))
                limitOrderServices.updateFavoritePairs(base, quote, to_fav)
            }else {
                this.props.dispatch(limitOrderActions.updateFavorite(base, quote, to_fav, false))
            }

        }

        render(){
            return <Component {...this.props}
                              onFavoriteClick={this.onFavoriteClick}
                              favorite_pairs={common.isUserLogin() ? this.props.favorite_pairs : this.props.favorite_pairs_anonymous}/>;

        }
    })

}
export default withFavorite;
