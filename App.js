/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, { Component } from "react";
 import { StyleSheet, View, Text } from "react-native";
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { NavigationContainer } from '@react-navigation/native';

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
        isLogin: true,
        access_token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiZjhkM2RmZDM3MTY4MDA2OWQ2YjMwMDJiOWRjMWY2MGRkNTcyYjIxNzRjMDE5M2E0NjEzNjk1NzU0ZjMwYmNjMmRiNjEyYmJiZjdhOWI5MjEiLCJpYXQiOjE2MjM2Mzg2ODUsIm5iZiI6MTYyMzYzODY4NSwiZXhwIjoxNjU1MTc0Njg1LCJzdWIiOiJoR2I1R0NUbjJPOWhpWE5tNVdLUSIsInNjb3BlcyI6W119.swb_t5wE60KB613MrDHcqjXDU8Evj595DpAIa7FGNalDOZEfuhuACZxJ-eoHyB_i22EaRD46iWQ1sCImbFLFDXl54ScYKC9LGdjpWeK1j5-SdE0OBCJ4wRRwxCSPk--jT9dSP7NcXmbSL9Z-4BonW0cQ1ZLaF0_MClMFQOo45zWx1SE6pQ_M7IK-IRBJXW4NO0kt-5HS7v0jNzYTZvlkAYUdup9CKPsPQDZxWgNbga6B1bkpwwKhKxz0wCL2FS8Llm4OD1Q832_4w7ur1pY6-lhrX8nxcOrZlc8Mrn99K_CLmgrwHrF6LY5zU7PW0DDTFDJxWwmixJlaud7HrDcH0hUDMTq2zmOzEA7qOUrqvN4bWCI8j3CHZ13auQ0foI-9HtEJR_O-_qjdyBiy5Z3vjR8tmGD0x3qrdBuajgOSn62c_N-jIOhnM1nkwmjE49TK8nz4jyxtVuCdFJvDOMQPZDS4B3fkOWm2z00V3WZcjedvXVEP7wRxMbOGVrQxXyEwy3WfNOzOOrAps0JVsSUhhjOuqrhwdqcLNwpKvNlfph6d8hhMfa5l61M3DjvRgwBl3_Oi8kTdTh8tEf7M-dfuLkKWtWrGPRvAZpYnaxQjpfzuPFSNYKa3gjNXKu58njgwtd46e5AuOuj246rzXvMCyjEw-DzsXWn8GaJJDhyRxkY',
      }
    }
    
    onChangeLogin = (_status) => {
      this.setState({
        isLogin: _status,
      })
    }

    setToken = (str) => {
      this.setState({
        access_token: str
      })
    }
  
    render() {
      return (
        <View>
          {!this.state.isLogin

            ? <Login
                onChangeLogin={this.onChangeLogin}
                setToken={this.setToken} /> 

            : <View style={styles.main}>
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