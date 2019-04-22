import React, { Component } from 'react';
import { View, Text, Button, StatusBar } from 'react-native';
import api from '../services/api';

export default class Main extends Component {
	state = {
		businesses: []
	};

	static navigationOptions = {
		title: 'PizzaMe',
		headerStyle: {
			backgroundColor: '#FF5900'
		},
		headerTitleStyle: {
			fontWeight: 'bold'
		},
		headerTintColor: '#fff'
	};

	componentDidMount() {
		this.loadLocations();
	}

	loadLocations = async () => {
		const response = await api.get();

		const { businesses } = response.data;

		this.setState({ businesses });

		console.log('Fetched businesses..')
	};

	render() {
		return (
			<View>
				<StatusBar barStyle="light-content" />
				<Text>Best rated pizza places nearby:</Text>
				{this.state.businesses.map((business) => (
					<Text key={business.id}>{business.name}</Text>
				))}
			</View>
		);
	}
}
