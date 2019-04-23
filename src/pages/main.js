import React, { Component } from 'react';
import { View, Text, Button, StatusBar, Platform } from 'react-native';
import api from '../services/api';
import { Constants, Location, Permissions } from 'expo';

export default class Main extends Component {
	state = {
		businesses: [],
		location: null,
		errorMessage: null
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

	componentDidMount() {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
			});
		} else {
			this._getLocationAsync();
		}

		this.loadLocations();
	}

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Location access was denied..'
			});
		}
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	};

	loadLocations = async () => {
		const response = await api.get();

		const { businesses } = response.data;

		this.setState({ businesses });

		console.log('Fetched businesses..');
	};

	render() {
		let text = 'Waiting...';
		if (this.state.errorMessage) {
			text = this.state.errorMessage;
		} else if (this.state.location) {
			text = JSON.stringify(this.state.location);
		}
		return (
			<View>
				<StatusBar barStyle="light-content" />
				<Text>Best rated pizza places nearby:</Text>
				<Text>Your location is {text}</Text>
				{this.state.businesses.map((business) => (
					<Text key={business.id}>
						{business.name} with {business.rating}
					</Text>
				))}
			</View>
		);
	}
}
