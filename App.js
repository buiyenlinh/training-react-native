/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, { Component } from "react";
 import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { NavigationContainer } from '@react-navigation/native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 import Icon from 'react-native-vector-icons/FontAwesome';
 import List from "./components/List"
 import Login from "./components/Login"
 import Follow from "./components/Follow"
 import Chart from "./components/Chart"
 import Notification from "./components/Notification"
 import User from "./components/User"

 const Tab = createBottomTabNavigator();

  class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLogin: false,
        access_token: ''
      }
    }
    
    onChangeLogin = (_status) => {
      this.setState({
        isLogin: _status,
      })
    }

    getData = async () => {
      try {
        const token = await AsyncStorage.getItem('@token')
        this.setState({
          access_token: token
        })
      } catch(e) {
        console.log("error getdata " + e);
      }
    }

    componentDidMount = () => {
      this.getData();
    }

    logout = () => {
      AsyncStorage.removeItem('@token');
      this.setState({
        access_token: '',
        isLogin: false
      })
      console.log('logout')
    }
  
    render() {
      return (
        <View>
          {!this.state.isLogin

            ? <Login onChangeLogin={this.onChangeLogin}/> 
            : <View style={styles.main}>
                <TouchableOpacity onPress={this.logout}>
                  <Text>Đăng xuất</Text>
                </TouchableOpacity>
                <NavigationContainer>
                  <Tab.Navigator
                    screenOptions={({ route }) => ({
                      tabBarIcon: ({ focused, color }) => {
                        let iconName;
                        if (route.name === 'List') {
                          iconName = 'list'
                        } else if (route.name === 'Follow') {
                          iconName = 'television'
                        } else if (route.name === 'Chart') {
                          iconName = 'circle-o'
                        } else if (route.name === 'Notification') {
                          iconName = 'bell'
                        } else if (route.name === 'User') {
                          iconName = 'user'
                        }

                        return <Icon name={iconName} size={20} color={color}/>;
                      },
                      tabBarActiveTintColor: '#1a9783',
                      tabBarInactiveTintColor: '#333',
                      tabBarStyle: {
                        height: 65,
                        paddingBottom: 5,
                        borderTopWidth: 2,
                        borderStyle: 'solid',
                        borderTopColor: '#1a9783',
                      },
                      headerShown: false
                    })}
                  >
                    <Tab.Screen
                      name="List"
                      children={()=><List access_token={this.state.access_token}/>}
                    />
                    <Tab.Screen name="Follow" component={Follow} />
                    <Tab.Screen name="Chart" component={Chart} />
                    <Tab.Screen name="Notification" component={Notification} />
                    <Tab.Screen name="User" component={User} />
                  </Tab.Navigator>
                </NavigationContainer>
              </View>}
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    main: {
     height: '100%',
    },
    menu: {
      height: 60,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: '#1a9783',
    },
  })
 
 export default App;