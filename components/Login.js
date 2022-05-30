import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView, TouchableHighlight, ActivityIndicator  } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from 'react-native-vector-icons/FontAwesome';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      is_valid_user: false,
      is_valid_pass: false,
      error_username: '',
      error_password: '',
      show_password: false,
      error: '',
      is_loading: false,
      is_mounted: false,
    }
  }

  componentDidMount() {
    this.setState({is_mounted: true})
  }
 
  componentWillUnmount = () => {
    this.setState({is_mounted: false})
  }

  onHideShow = () => {
    if (this.state.is_mounted)
      this.setState({show_password: !this.state.show_password})
  }

  checkUsername = (e) => {
    this.setState({
      username: e.nativeEvent.text,
    }, () => {
      if (this.state.username === '' || this.state.username === null) {
        this.setState({
          error_username: '(*) Tên tài khoản là bắt buộc',
          is_valid_user: false
        });
      } else { 
        if (this.state.is_mounted) {
          this.setState({
            error_username: '',
            is_valid_user: true
          })
        }
      }
    });
  }

  checkPassword = (e) => {
    this.setState({
      password: e.nativeEvent.text
    }, () => {
      if (this.state.password === '' || this.state.password === null) {
        this.setState({
          error_password: '(*) Mật khẩu là bắt buộc',
          is_valid_pass: false
        })
      } else {
        this.setState({
          error_password: '',
          is_valid_pass: true
        })
      }
    })
  }

  handleLogin = () => {
    if (!this.state.is_valid_pass) {
      this.setState({
        error_password : '(*) Mật khẩu là bắt buộc',
      })
    }

    if (!this.state.is_valid_user) {
      this.setState({
        error_username: '(*) Tên tài khoản là bắt buộc',
      })
    }

    if (this.state.is_valid_user && this.state.is_valid_pass) {
      this.login();
    }
  }

  login = async () => {
    this.setState({is_loading: true });
    await axios.post('https://qlsc.maysoft.io/server/api/auth/login', {
      username: this.state.username,
      password: this.state.password,
    },
    ).then(response => {
      if (response.data.status) {
        let token = response.data.data.token_type + ' ' + response.data.data.access_token;
        this.props.onChangeLogin(true);

        this.storeData(token)
      } else {
        this.setState({
          error: response.data.errors,
        })
      }
    }).catch (err => {
      console.log(err);
    }).finally(() => {
      this.setState({is_loading: false})
    })
  } 

  storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@token', value)
    } catch (e) {
      console.log('error store data' + e);
    }
  }

  render() {
    return ( 
      <View style={{height: '100%'}}>
        {
          this.state.is_loading
          ?
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0a8f9e" />
          </View>
          : null
        }
        <ScrollView>
          <View style={styles.container}>
              <View style={styles.container_logo}>
                <Image 
                  source={require('../assets/favicon.png')}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            
              <Text style={{fontWeight: 'bold', padding: 3, color: '#333'}}>
                Tên tài khoản <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên tài khoản"
                onChange={(e) => this.checkUsername(e)}
              />
              {
                this.state.error_username
                ? <Text style={{color: 'red', fontStyle: 'italic', padding: 3}}>{this.state.error_username}</Text>
                : null
              }
              
              <Text style={{fontWeight: 'bold', padding: 3, color: '#333', marginTop: 15}}>
                Mật khẩu <Text style={{color: 'red'}}>*</Text>
              </Text>
              <View style={styles.input_password}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!this.state.show_password}
                  onChange={(e) => this.checkPassword(e)}
                />
                <TouchableOpacity style={styles.show_password} onPress={this.onHideShow}>
                  { 
                    this.state.show_password
                    ? <Icon1 name="eye-slash" size={20} color="#228c8b" /> 
                    : <Icon1 name="eye" size={20} color="#228c8b" />
                  }
                </TouchableOpacity>
              </View>
              {
                this.state.error_password
                ? <Text style={{color: 'red', fontStyle: 'italic', padding: 3}}>{this.state.error_password}</Text>
                : null
              }

              <TouchableHighlight onPress={this.handleLogin} style={{marginTop: 25}}>
                <View style={styles.touch_able_highlight}>
                  <Text style={{color: '#fff', fontSize: 16}}>Đăng nhập</Text>
                </View>
              </TouchableHighlight>

              <Text style={{color: 'red', fontStyle: 'italic', padding: 3, textAlign: 'center'}}>{this.state.error}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
  },
  input_password: {
    position: 'relative'
  },
  container: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: 40,
    marginTop: 50
  },
  container_logo: {
    alignItems: 'center',
  },
  show_password: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  touch_able_highlight: {
    backgroundColor: '#0a8f9e',
    alignItems: 'center',
    padding: 10,
  },
  loading: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  }
})