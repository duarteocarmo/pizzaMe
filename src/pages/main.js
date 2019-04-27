import React, { Component } from 'react';
import { View, Text, StatusBar, Platform, FlatList, StyleSheet } from 'react-native';
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
			backgroundColor: '#CD3D23'
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

	renderItem = ({ item }) => (
		<View style={styles.restaurantContainer}>
			<Text style={styles.restaurantTitle}>{item.name}</Text>
			<Text style={styles.restaurantRating}>Rating: {item.rating}/5</Text>
			<Text style={styles.restaurantPrice}>{item.price}</Text>
		</View>
	);

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
				<View style={styles.container}>
					<FlatList
						data={this.state.businesses}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => item.id}
						contentContainerStyle={styles.list}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	list: {
		padding: 15
	},
	restaurantContainer: {
		backgroundColor: '#F4F4F4',
		borderWidth: 1,
		borderColor: '#F4F4F4',
		borderRadius: 5,
		padding: 15,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
		// flexDirection: 'row',
		// flex: 1
	},
	restaurantTitle: {
		fontWeight: 'bold',
		fontSize: 15
	},
	container: {
		backgroundColor: '#FE9D00'
	},
	restaurantPrice: {},
	restaurantRating: {}
});
