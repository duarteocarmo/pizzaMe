import React, { Component } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import api from '../services/api';
import { Constants, Location, Permissions } from 'expo';

export default class Main extends Component {
	state = {
		businesses: [],
		location: null,
		errorMessage: null,
		latitude: null,
		longitude: null
	};

	static navigationOptions = {
		title: 'PizzaMe 🍕',
		headerStyle: {
			backgroundColor: '#FE9D00'
		},
		headerTitleStyle: {
			fontWeight: 'bold'
		},
		headerTintColor: '#fff'
	};

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Location access was denied..'
			});
		}
		let location = await Location.getCurrentPositionAsync({});
		console.log('Location was set.');
		this.setState({ location }, () => {
			this.loadLocations();
		});
	};

	loadLocations = async () => {
		console.log(this.state.location.coords.latitude);

		const response = await api.get('/', {
			params: {
				categories: 'pizza',
				latitude: `${this.state.location.coords.latitude}`,
				longitude: `${this.state.location.coords.longitude}`
			}
		});

		const { businesses } = response.data;

		this.setState({ businesses });
	};

	componentDidMount() {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
			});
		} else {
			this._getLocationAsync();
		}
	}

	render() {
		let text = 'Waiting...';
		if (this.state.errorMessage) {
			// dont present anyting...
			text = this.state.errorMessage;
		} else if (this.state.location) {
			text = JSON.stringify(this.state.location);
		}
		return (
			<View>
				<StatusBar barStyle="light-content" />
				<Text>Best rated pizza places nearby:</Text>
				<Text >Location Object:{text}</Text>
				{this.state.businesses.map((business) => (
					<Text key={business.id}>
						{business.name} with {business.rating}
					</Text>
				))}
			</View>
		);
	}
}
