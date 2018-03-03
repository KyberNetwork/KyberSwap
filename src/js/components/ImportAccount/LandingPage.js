import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import Slider from "react-slick"

@connect((store, props) => {
	return {
		translate: getTranslate(store.locale)
	}
})

export default class LandingPage extends React.Component {

	componentDidMount() {
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
  }

	render() {
		const settings = {
			autoplay: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true,
		};
		return (
			<div id="carousel">
				<Slider {...settings}>
					<div className="d-flex slide slide-1">
						<div className="m-auto text-center text-white">
							<h2>Open to Public</h2>
							<p>Our Exchange Service is now open to everyone! Sign up for an user account to start exchange</p>
							<a className="button" target="_blank" href="https://account.kyber.network/users/sign_up">Register</a>
						</div>
					</div>
					<div className="d-flex slide slide-2">
						<div className="m-auto text-center text-white">
							<h2 className="mb-5">Trade Now Win KNC</h2>
							<a className="button" target="_blank" href="https://blog.kyber.network/kyber-network-announcements-monday-feb-26th-75c28e264fb6">More details</a>
						</div>
					</div>
				</Slider>
			</div>
		)
	}
}