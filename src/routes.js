import { createAppContainer, createStackNavigator } from 'react-navigation';
import Main from './pages/main';

const AppNavigator = createStackNavigator({
	Main
});

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
