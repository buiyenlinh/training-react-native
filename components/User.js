import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export default class User extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.handleSetLogout}>
          <View style={styles.btn_logout}>
            <Text style={{textAlign: 'center', color: '#fff'}}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btn_logout: {
    backgroundColor: '#0c5e78',
    borderWidth: 1,
    padding: 10,
  }
})