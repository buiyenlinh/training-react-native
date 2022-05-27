import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, LogBox, Modal, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import moment from "moment";
import DatePicker from 'react-native-neat-date-picker'
import ItemReportList from './ItemReportList';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      searchStatus: null,
      is_mounted: false,
      commonCode: [],
      showDatePicker: false,
      datePicker: {
        startDate: '',
        startDateString: '',
        endDate: '',
        endDateString: ''
      },
      is_loading: false,
      modalVisible: false,
      modalAddVisible: false
    }
  }

  openDatePicker = () => {
    this.setState({showDatePicker: true})
  }

  onCancel = () => {
    this.setState({showDatePicker: false})
  }

  onConfirm = (output) => {
    this.onCancel();
    const {startDate, startDateString, endDate, endDateString} = output;
    this.setState({
      datePicker: {
        startDate: startDate.getTime() / 1000,
        startDateString: startDateString,
        endDate: endDate.getTime() / 1000,
        endDateString: endDateString
      }
    }, () => {
      this.getListReport()
    })
  }

  getListReport = async () => {
    const filter = {
      page: 1
    }

    if (this.state.searchStatus != null) {
      filter['status'] = this.state.searchStatus
    }

    if (this.state?.datePicker?.endDate > 0 && this.state?.datePicker?.startDate > 0) {
      filter['reportTime'] = this.state?.datePicker?.startDate + ', ' + this.state?.datePicker?.endDate
    }

    this.setState({is_loading: true})
    axios.post('https://qlsc.maysoft.io/server/api/getAllReports', filter, {
      headers: {
        'Authorization': this.props.access_token
      }
    }).then(response => {
      if (this.state.is_mounted) {
        this.setState({departments: response.data.data.data})
      }
    }).catch(err => {
      console.log('Error GetListReports: ' + err);
      this.setState({is_loading: false})
    }).finally(() => {
      this.setState({is_loading: false})
    })
  }

  getCommonCode = async (_group) => {
    axios.post('https://qlsc.maysoft.io/server/api/getCommon', {
        groups: _group
      },
      {
        headers: {
          'Authorization': this.props.access_token
        }
      }
    ).then(response => {
      if (this.state.is_mounted) {
        this.setState({commonCode: response.data.data})
      }
    }).catch(err => {
      console.log('Error getCommonCode: ' + err);
    })
  }

  convertIntToDate(_int) {
    return moment(new Date(_int * 1000)).format('MM/DD/YYYY hh:MM')
  }

  handleFiler = () => {
    if (this.state.datePicker?.startDate > 0 && this.state.datePicker?.endDate > 0) {
      this.setState({is_loading: true})
      const arr = this.state.departments.filter((_department) => 
        (_department.reportTime * 1000 >= this.state.datePicker?.startDate && _department.reportTime * 1000 <= this.state.datePicker?.endDate)
      );
      
      this.setState({
        departments: arr
      }, () => {
        this.setState({is_loading: false})
      })
    }
    
  }

  componentDidMount = () => {
    this.setState({is_mounted: true});
    this.getListReport();
    this.getCommonCode('incidentObject, reportStatus, reportType');
  }

  componentWillUnmount = () => {
    this.setState({is_mounted: false})
  }

  getReportStatus = (code) => {
    this.setState({
      searchStatus: code,
      modalVisible: false
    }, () => this.getListReport())
  }

  render() {
    LogBox.ignoreLogs(["EventEmitter.removeListener"]);
    return (
      <View style={styles.department}>
        {
          this.state.is_loading
          ?
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0a8f9e" />
          </View>
          : null
        }
        <View style={styles.header}>
          <View style={styles.date_picker}>
            <Text>
              { this.state.datePicker?.startDate 
              ? this.state.datePicker?.startDateString + ' - ' +  this.state.datePicker?.endDateString
              : ''}
            </Text>
            <Icon1 name="calendar" size={20} color="#228c8b" onPress={this.openDatePicker} />
            <DatePicker
              isVisible={this.state.showDatePicker}
              mode={'range'}
              onCancel={this.onCancel}
              onConfirm={this.onConfirm}
            />
          </View>
          <Icon1 name="filter" size={35} color="#228c8b" onPress={() => {this.setState({modalVisible: true})}}/>
        </View>
       
        <ScrollView>
          <View style={styles.content}>
          {
            this.state.departments?.length > 0 ?
              this.state.departments.map((item) => {
                return (
                  <ItemReportList key={item.id} itemList={item} commonCode={this.state.commonCode} />
                )
              })
            : <Text>Danh sách rỗng</Text>
          }
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.touch_able_opacity_plus} onPress={() => {this.setState({modalAddVisible: true})}}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 25}}>
          <Icon name="plus" size={25} color="#fff" />
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={this.state.modalVisible}>
            <View style={styles.modal}>
              <View style={styles.modal_container}>
                <View style={styles.modal_header}>
                  <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>Tìm kiếm</Text>
                  <TouchableOpacity>
                    <Icon1 name="close" size={25} color="#228c8b" onPress={() => this.setState({modalVisible: false})} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modal_content}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>Trạng thái báo cáo: </Text>
                  {
                    this.state.commonCode?.reportStatus?.map((item) => {
                      return (
                        <TouchableOpacity key={item.id} style={styles.pickStatus} onPress={() => {this.getReportStatus(item.code)}}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
              </View>
            </View>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.modalAddVisible}>
            <View style={styles.modal}>
              <View style={styles.modal_container}>
                <View style={styles.modal_header}>
                  <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>Thêm báo cáo mới</Text>
                  <TouchableOpacity>
                    <Icon1 name="close" size={25} color="#228c8b" onPress={() => this.setState({modalAddVisible: false})} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modal_content}>
                  <Text>Nội dung</Text>
                </View>
              </View>
            </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  department: {
    height: '100%'
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1a9783',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },

  input_border: {
    borderStyle: 'solid',
    borderColor: '#1a9783',
    borderWidth: 2,
    width: '80%',
    borderRadius: 5
  },
  content: {
    padding: 10,
  },
  menu: {
    height: 60,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#1a9783'
  },
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
  touch_able_opacity_plus: {
    borderWidth: 2,
    borderColor: '#1a9783',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 2,
    borderRadius: 99,
    backgroundColor: '#1a9783',
  },
  date_picker: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1a9783',
    borderRadius: 5,
    width: '80%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_container: {
    width: '85%',
    backgroundColor: 'white',
    padding: 15,
    elevation: 5,
  },
  modal_header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  modal_content: {
    paddingVertical: 15
  },
  pickStatus: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    marginVertical: 5,
    padding: 5,
  }
})
