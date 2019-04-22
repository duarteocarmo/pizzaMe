import axios from 'axios';
import { REACT_APP_YELP_API_KEY } from 'react-native-dotenv';

const api = axios.create({
	baseURL: 'https://api.yelp.com/v3/businesses/search?',
	headers: {
		Authorization: `Bearer ${REACT_APP_YELP_API_KEY}`
	},
	params: { latitude: '55.695594', longitude: '12.550354', categories: 'pizza', sort_by: 'rating' }
});

export default api;
