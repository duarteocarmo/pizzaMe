import React, { Component } from 'react';
import { View, Text, Button, StatusBar } from 'react-native';

export default class Main extends Component {
	static navigationOptions = {
		title: 'PizzaMe',
		headerStyle: {
			backgroundColor: '#CD3D23'
		},
		headerTitleStyle: {
			fontWeight: 'bold'
		},
		headerTintColor: '#fff'
	};
	render() {
		return (
			<View>
				<StatusBar hidden="false" barStyle="light-content" />
				<Text>Aqui vou começar a mostrar bue da sitios para comer pizaa...</Text>
			</View>
		);
	}
}
