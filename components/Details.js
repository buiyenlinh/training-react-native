import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Details!</Text>
        <Text>Hello {this.props.test_props}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({})