import React from "react"

const TermModal = (props) => {
	return (
		<div className="term-services text-center">
			<div class="mb-5">
				<img src={require("../../../assets/img/terms-icon.svg")} />
			</div>
			<p className="term-text mb-0">
				{props.translate("terms.accept") || "Please accept"}
				<a className="text-success" href="https://home.kyber.network/assets/tac.pdf" target="_blank">
					{props.translate("terms.terms_and_condition") || " Terms and Conditions "}
				</a>
				{props.translate("terms.to_get_started") || " to get started"}
			</p>
			<button class="button accent mt-4 cur-pointer" onClick={props.goToImport}>
				Accept
			</button>
		</div>
	)
}

export default TermModal;