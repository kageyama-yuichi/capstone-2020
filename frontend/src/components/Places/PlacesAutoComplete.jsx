import React from "react";
import PlacesResource from "./PlacesResource.js";
import debounce from "lodash.debounce";
import "./PlacesAutoComplete.css";
import { Spinner } from "react-bootstrap";
import {ENABLE_AUTOCOMPLETE} from "../../Constants.js"

class PlacesAutocomplete extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			suggestions: [],
			value: props.value,
			//Default location set to Melbourne
			location: "37.8136,144.9631",
			sessionToken: props.sessionToken,
			isExpanded: false,
			activeSuggestionId: null,
			minLetters: props.minLetters,
		};

		this.setLocation = this.setLocation.bind(this);
		this.debouncedFetchPredictions = debounce(this.fetchPredictions, this.props.debounce);
	}

	geoLocate() {
		if (navigator.geolocation) {
			//60s timeout
			var options = {timeout: 60000};
			navigator.geolocation.getCurrentPosition(
				this.setLocation,
				this.locationErrorHandler,
				options
			);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}

	setLocation(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		this.setState({location: `${latitude},${longitude}`});
	}

	locationErrorHandler(err) {
		console.log("Error when getting geolocation.");
	}

	componentDidMount() {
		this.geoLocate();
	}

	callBack = (predictions, status) => {
		this.setState({loading: false});
		if (status !== "OK") {
			return;
        }
		this.setState({
			suggestions: predictions,
		});
	};

	clearSuggestions = () => {
		this.setState({suggestions: []});
	};

    fetchPredictions = () => {
		const {value} = this.props;
		if (value.length) {
			this.setState({loading: true});
			PlacesResource.getSuggestions(value, this.state.sessionToken, this.state.location).then(
                (res) => {
                    
					this.callBack(res.data.predictions, res.data.status);
				}
            ).catch((err) => {
                this.setState({ loading: false });
            });
		}
	};


	handleInputChange = (event) => {
		const {value} = event.target;
		this.props.onChange(value);
		this.setState({value: value});
		if (!value) {
			this.clearSuggestions();
			return;
		}
		if (this.props.shouldFetchSuggestions && value.length > this.state.minLetters) {
			this.debouncedFetchPredictions();
		}
	};

	handleSelect(address) {
		this.clearSuggestions();
		this.props.onChange(address);
	}

	handleSuggestionMouseDown(suggestion, event) {
		event.preventDefault();
		this.handleSelect(suggestion.description);
	}

	handleBlur() {
		document.getElementById("autocomplete-dropdown-container").style.display = "none";
	}

	handleFocus() {
		document.getElementById("autocomplete-dropdown-container").style.display = "block";
	}

	getSuggestionItemProps = (suggestion, options = {}) => {
		const handleSuggestionMouseDown = this.handleSuggestionMouseDown.bind(this, suggestion);
		return {
			...options,
			key: suggestion.id,
			role: "option",
			onMouseDown: handleSuggestionMouseDown,
		};
	};

	getInputProps = (options = {}) => {
		
		const handleBlur = this.handleBlur.bind(this);
		const handleFocus = this.handleFocus.bind(this);

		const defaultInputProps = {
			type: "text",
			autoComplete: "justdont",
		};
		return {
			...defaultInputProps,
			...options,
			onBlur: handleBlur,
			onFocus: handleFocus,
			value: this.props.value,
			onChange: (event) => {
				this.handleInputChange(event);
			},
		};
	};


    render() {
		return (
			<div>
				<input
					{...this.getInputProps({
						autoComplete: "justdont",
						name: "address",
						placeholder: "Address",
						required: true,
						className: "location-search-input form-control :required",
					})}
				/>
				{this.state.loading && <Spinner animation="grow"></Spinner>}
				<div
					id="autocomplete-dropdown-container"
					className="autocomplete-dropdown-container zindex-dropdown">
					{this.state.suggestions.map((suggestion) => {
						return (
							<div
								{...this.getSuggestionItemProps(suggestion, {
									className: "suggestion-item",
								})}>
								<span>{suggestion.description}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

PlacesAutocomplete.defaultProps = {
	debounce: 200,
	shouldFetchSuggestions: ENABLE_AUTOCOMPLETE,
	minLetters: 5,
};
export default PlacesAutocomplete;
