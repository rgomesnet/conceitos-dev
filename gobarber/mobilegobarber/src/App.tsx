import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Routes from './routes';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './hooks';


const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AppProvider>
      <View style={styles.view}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#312e38',
  },
});
