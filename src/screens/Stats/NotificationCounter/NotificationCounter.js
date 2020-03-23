import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import { connect } from 'react-redux';

import LineChart from '../../../components/UI/LineChart/LineChart';
import Text from '../../../components/UI/Text/Text';
import { BELL, DOUBLE_LEFT_ARROW, DOUBLE_RIGHT_ARROW } from '../../../util/icons';
import { BLUE, GRAY1, PURPLE } from '../../../util/color';
import { fetchStats, resetError, cleanStats } from '../../../store/actions/index';
import Loading from '../../../components/UI/Loading/Loading';

class NotificationCounter extends Component {
  state = {
    refreshing: false,
    page: 1,
    finished: -1,
    data: null,
    stats: null,
    total: 0,
    currCount: 0,
    currDate: ''
  }
  componentDidMount() {
    this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'notifications', this.props.token, this.props.route.params.initialData);
  }
  componentWillUnmount() {
    this.props.onCleanStats();
    this.props.onResetError();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if((this.props.stats.length !== nextProps.stats.length) || (this.props.isFinished !== nextProps.isFinished) ) {
      this.setData(this.state.page, nextProps.stats, nextProps.isFinished);
    }
  }

  getTimeLabel = (data) => {
    if(data.date === this.props.route.params.initialData.date) {
      return 'Today';
    } else {
      return data.timeFormate ? data.timeFormate : 'None';
    }
  }

  setData = (page, stats, isFinished) => {
    const start = (page - 1) * 7;
    const end = page * 7;
    stats = stats.slice(start, end);
    stats = stats.reverse();
    if(stats.length < 7 && !isFinished) {
      this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'notifications', this.props.token);
    } else {
      let labels = [];
      let dataPoints = [];
      let total = 0;
      let count;
      let l = stats.length;
      let finished = this.state.finished;

      stats.forEach(el => {
        labels.push(el.day);
        count = el.count ? el.count : 0;
        total += count;
        dataPoints.push(count);
      });
      const data = {
        labels,
        datasets: [{
          data: dataPoints
        }]
      };
      
      if(isFinished && stats.length < 7 ) {
        finished = page;
      }
      if(isFinished && stats.length === 0) {
        finished = page - 1;
      }
      this.setState({ 
        stats, 
        data, 
        total, 
        currCount: stats[l-1].count ? stats[l-1].count : 0, 
        currDate: this.getTimeLabel(stats[l-1]), 
        finished 
      });
    }
  }

  onRefresh = () => {
    this.props.onCleanStats();
    this.props.onResetError();
    this.setState({
      page: 1,
      finished: -1,
      data: null,
      stats: null,
      total: 0,
      currCount: 0,
      currDate: ''
    });
    this.props.onFetchStatsStart(1, this.props.pageSize, 'notifications', this.props.token, this.props.route.params.initialData);
  }

  onChangePage = (type) => {
    let page = this.state.page;
    if(type === 'left') {
      page = page + 1;
    } else if(type === 'right') {
      page = page - 1;
    }
    this.setState({ page });
    this.setData(page, this.props.stats, this.props.isFinished);
  }
  
  render() {
    let ren = null;
    const leftArrow = (
      <View style={style.arrow} >
        <Icon name={DOUBLE_LEFT_ARROW} size={30} color={this.state.page === this.state.finished ? GRAY1 : '#000'} />
      </View>
    );
    const rightArrow = (
      <View style={style.arrow} >
        <Icon name={DOUBLE_RIGHT_ARROW} size={30} color={this.state.page === 1 ? GRAY1 : '#000'} />
      </View>
    );
    if((!this.props.loading && this.props.stats.length > 0) && this.state.data ) {
      ren = (
        <View>
          <View style={style.controls} >
            {this.state.page === this.state.finished ? leftArrow : (
              <TouchableWithoutFeedback onPress={() => this.onChangePage('left')} >
                {leftArrow}
              </TouchableWithoutFeedback>
            )}
            <View style={[style.arrow, { width: '40%' }]} >
              <Text text={this.state.currDate} style={{ fontFamily: 'Rubik-Medium' }} numberOfLines={1} />
            </View>
            {this.state.page === 1 ? rightArrow : (
              <TouchableWithoutFeedback onPress={() => this.onChangePage('right')} >
                {rightArrow}
              </TouchableWithoutFeedback>
            )}
          </View>
          <Text text={`${this.state.currCount} Notifications`} type='h4' style={{ marginVertical: 30 }} />

          <LineChart 
            data={this.state.data}
            onDataPointClick={(data) => {
              this.setState({ 
                currCount: this.state.stats[data.index].count ? this.state.stats[data.index].count : 0, 
                currDate: this.getTimeLabel(this.state.stats[data.index])
              })
            }}
          />
          
          <Text text={`${this.state.total} notifications this week!`} type='h5' style={{ marginVertical: 20, fontFamily: 'Rubik-Light' }} />
        </View>
      );
    } else {
      ren = (
        <View style={{ marginTop: Dimensions.get('screen').height / 5 }} >
          <Loading />
        </View>
      );
    }
    if(this.props.error) {
      ren = (
        <View style={{ width: '90%', alignSelf: 'center', marginTop: Dimensions.get('screen').height /5 }} >
          <Text text='Error!' type='h4' style={{ color: PURPLE, marginVertical: 20 }} />
          <Text text='Please try again!' type='h5' />
        </View>
      );
    }
    return (
      <ScrollView style={{ backgroundColor: '#fff' }}
        refreshControl={
          <RefreshControl 
            refreshing={this.state.refreshing} 
            onRefresh={this.onRefresh} 
            colors={[PURPLE]} />
        }
      >
        <View style={style.header} >
          <View style={style.title} >
            <View>
              <Text text='Notification Counter' type='h3' style={{ color: BLUE }} />
            </View>
            <View style={style.icon} >
              <Icon name={BELL} size={30} color={'#000'} />
            </View>
          </View>
        </View>
        {ren}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  header: {
    // backgroundColor: 'blue',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controls: {
    // backgroundColor: 'green',
    height: 45,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  title: {
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  arrow: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    width: '20%',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    pageNumber: state.stats.pageNumber,
    pageSize: state.stats.pageSize,
    isFinished: state.stats.isFinished,
    loading: state.loading.loading,
    error: state.error.error,
    stats: state.stats.stats
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStatsStart: (pageNumber, pageSize, type, token, initialData) => dispatch(fetchStats(pageNumber, pageSize, type, token, initialData)),
    onResetError: () => dispatch(resetError()),
    onCleanStats: () => dispatch(cleanStats())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCounter);