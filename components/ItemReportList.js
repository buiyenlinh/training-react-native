import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';

export default class ItemReportList extends Component {
  constructor(props) {
    super(props);
  }

  convertIntToDate(_int) {
    return moment(new Date(_int * 1000)).format('MM/DD/YYYY hh:MM')
  }


  render() {
    return (
      <TouchableOpacity style={styles.item_list}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', color: 'black'}}>{this.props.itemList?.reportNo}</Text>
            {
              this.props?.commonCode?.reportStatus?.map((rs_item, index) => {
                if (rs_item?.code == this.props.itemList?.status) {
                  return (
                    <Text key={index} style={this.props.itemList?.status == 0 ? styles.reportStatusNew : styles.reportStatus}>
                      {rs_item?.name}
                    </Text>
                  )
                }
              })
            }
          </View>
          <Text style={{fontStyle: 'italic'}}>{this.convertIntToDate(this.props.itemList?.reportTime)}</Text>
          <View style={{flexDirection: 'row'}}>
            {
              this.props.commonCode?.reportType?.map((rt_item, index) => {
                if (rt_item.code == this.props.itemList?.reportType) {
                  return (
                    <Text key={index}>
                      {rt_item.name}
                    </Text>
                  )
                }
              })
            }
            <Text> | </Text>
            {
              this.props.commonCode?.incidentObject?.map((ict_item, index) => {
                if (ict_item.code == this.props.itemList?.incidentObject) {
                  return (
                    <Text key={index}>
                      {ict_item.name}
                    </Text>
                  )
                }
              })
            }
          </View>
          <Text>{this.props.itemList?.detector}</Text>
          <Text>{this.props.itemList?.shortDescription}</Text>
        </View>
        <Icon name="dots-three-vertical" size={25} color="#1a9783" />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  item_list: {
    borderStyle: 'solid',
    borderColor: '#a92222',
    borderWidth: 1,
    borderRadius: 6,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  reportStatus: {
    fontWeight: 'bold',
    color: 'orange',
    marginLeft: 10
  },
  reportStatusNew: {
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 10
  },
})