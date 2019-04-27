import React, { Component } from 'react';
import { View, Text, StatusBar, Platform, FlatList } from 'react-native';
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

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Location access was denied..'
			});
		}
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location }, () => {
			this.loadLocations();
		});
	};

	loadLocations = async () => {
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
				<Text>Location Object:{text}</Text>
				<FlatList 
				data={this.state.businesses}
				renderItem={({ item }) => <Text key={item.id}>{item.name}</Text>} 
				keyExtractor={(item, index) => item.id}
				/>
			</View>
		);
	}
}
