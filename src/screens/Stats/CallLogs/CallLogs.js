import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, TouchableNativeFeedback, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import { connect } from 'react-redux';

import LineChart from '../../../components/UI/LineChart/LineChart';
import StackedBarChart from '../../../components/UI/StackedBarChart/StackedBarChart';
import Text from '../../../components/UI/Text/Text';
import { CALL, DOUBLE_LEFT_ARROW, DOUBLE_RIGHT_ARROW } from '../../../util/icons';
import { BLUE, GRAY1, GRAY2, PURPLE, STACKED_BAR_1, STACKED_BAR_2, STACKED_BAR_3 } from '../../../util/color';
import { fetchStats, resetError, cleanStats } from '../../../store/actions/index';
import Loading from '../../../components/UI/Loading/Loading';
import { secToMinRound } from '../../../util/util';
import { Value } from 'react-native-reanimated';

class CallLogs extends Component {
  state = {
    refreshing: false,
    activeType: 'incoming',
    page: 1,
    finished: -1,
    callsData: null,
    incomingCallsData: null,
    outgoingCallsData: null,
    totalCalls: 0,
    totalIncomingDur: 0,
    totalOutgoingDur: 0,
    stats: null,
    currCallCount: 0,
    currIncomingDur: 0,
    currOutgoingDur: 0,
    currDate: ''
  }
  componentDidMount() {
    this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'callStats', this.props.token, this.props.route.params.initialData);
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
      this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'callStats', this.props.token);
    } else {
      let labels = [];
      let callsDataPoints = [];
      let incomingDurDataPoints = [];
      let outgoingDurDataPoints = [];
      let totalCalls = 0;
      let totalIncomingDur = 0;
      let totalOutgoingDur = 0;
      let l = stats.length;
      let finished = this.state.finished;
      let temp;
      let incomingDuration;
      let outgoingDuration;

      stats.forEach((el, i) => {
        labels.push(el.day);
        temp = el.stats;
        
        if(!temp) {
          temp = {
            incoming: 0,
            outgoing: 0,
            missed: 0,
            incomingDuration: 0,
            outgoingDuration: 0
          }
          stats[i] = { ...stats[i], stats: temp }
        }
        incomingDuration = secToMinRound(temp.incomingDuration);
        outgoingDuration = secToMinRound(temp.outgoingDuration);
        totalCalls += (temp.incoming + temp.outgoing + temp.missed);
        totalIncomingDur += incomingDuration;
        totalOutgoingDur += outgoingDuration;
        callsDataPoints.push([temp.missed, temp.incoming, temp.outgoing]);
        incomingDurDataPoints.push(incomingDuration);
        outgoingDurDataPoints.push(outgoingDuration);

      });
      const incomingCallsData = {
        labels,
        datasets: [{
          data: incomingDurDataPoints
        }]
      };
      const outgoingCallsData = {
        labels,
        datasets: [{
          data: outgoingDurDataPoints
        }]
      };
      const callsData = {
        labels,
        legend: ["Missed", "Incoming", "Outgoing"],
        data: callsDataPoints,
        // data: [[1, 2, 3], [2, 3, 4], [0, 5, 2], [2, 2, 4], [2, 4, 6], [3, 1, 4], [1, 7, 3]],
        barColors: [STACKED_BAR_1, STACKED_BAR_2, STACKED_BAR_3]
      }

      
      if(isFinished && stats.length < 7 ) {
        finished = page;
      }
      if(isFinished && stats.length === 0) {
        finished = page - 1;
      }
      const curr = stats[l-1].stats;
      this.setState({ 
        stats, 
        callsData,
        incomingCallsData,
        outgoingCallsData, 
        totalCalls,
        totalIncomingDur: totalIncomingDur,
        totalOutgoingDur: totalOutgoingDur,
        currCallCount: curr.incoming + curr.outgoing + curr.missed,
        currIncomingDur: secToMinRound(curr.incomingDuration),
        currOutgoingDur: secToMinRound(curr.outgoingDuration),
        currDate: this.getTimeLabel(stats[l-1]), 
        finished 
      });
    }
  }

  showStackBarShart = () => {
    let total = 0;
    this.state.callsData.data.forEach(e => {
      e.forEach(val => {
        total += val;
      });
    });
    if(total === 0) return false;
    else return true;
  }

  onRefresh = () => {
    this.props.onCleanStats();
    this.props.onResetError();
    this.setState({
      page: 1,
      finished: -1,
      callsData: null,
      incomingCallsData: null,
      outgoingCallsData: null,
      totalCalls: 0,
      totalIncomingDur: 0,
      totalOutgoingDur: 0,
      stats: null,
      currCallCount: 0,
      currIncomingDur: 0,
      currOutgoingDur: 0,
      currDate: ''
    });
    this.props.onFetchStatsStart(1, this.props.pageSize, 'callStats', this.props.token, this.props.route.params.initialData);
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
  
  onChangeActive = (type) => {
    this.setState({ activeType: type });
  }
  onDataPointClick = (data) => {
    const curr = this.state.stats[data.index].stats;
    this.setState({ 
      currDate: this.getTimeLabel(this.state.stats[data.index]),
      currCallCount: curr.incoming + curr.outgoing + curr.missed,
      currIncomingDur: secToMinRound(curr.incomingDuration),
      currOutgoingDur: secToMinRound(curr.outgoingDuration)
    })
  };
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
    let active = null;
    if(this.state.activeType === 'incoming') {
      active = (
        <View>
          <Text text={`${this.state.currIncomingDur}min`} type='h4' style={{ marginVertical: 30 }} />
          <LineChart 
            data={this.state.incomingCallsData}
            onDataPointClick={this.onDataPointClick}
          />
          <Text text={`${this.state.totalIncomingDur}min this week!`} type='h5' style={{ marginVertical: 20, fontFamily: 'Rubik-Light' }} />
        </View>
      );
    } else if(this.state.activeType === 'outgoing') {
      active = (
        <View>
          <Text text={`${this.state.currOutgoingDur}min`} type='h4' style={{ marginVertical: 30 }} />
          <LineChart 
            data={this.state.outgoingCallsData}
            onDataPointClick={this.onDataPointClick}
          />
          <Text text={`${this.state.totalOutgoingDur}min this week!`} type='h5' style={{ marginVertical: 20, fontFamily: 'Rubik-Light' }} />
        </View>
      );
    }

    if((!this.props.loading && this.props.stats.length > 0) && this.state.callsData ) {
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

          <Text text={`${this.state.currCallCount} Calls`} type='h4' style={{ marginVertical: 30 }} />

          {this.showStackBarShart() ? (
            <StackedBarChart 
            data={this.state.callsData}
            onDataPointClick={this.onDataPointClick}
          />
          ) : null}

          <View style={style.lengends} >
            <View style={style.lengend} >
              <View style={[style.dot, { backgroundColor: STACKED_BAR_1 }]} ></View>
              <Text text='Missed' type='h6' />
            </View>
            <View style={style.lengend} >
              <View style={[style.dot, { backgroundColor: STACKED_BAR_2 }]} ></View>
              <Text text='Incoming' type='h6' />
            </View>
            <View style={style.lengend} >
              <View style={[style.dot, { backgroundColor: STACKED_BAR_3 }]} ></View>
              <Text text='Outgoing' type='h6' />
            </View>
          </View>

          <Text text={`${this.state.totalCalls} calls this week!`} type='h5' style={{ marginVertical: 20, fontFamily: 'Rubik-Light' }} />
            
          <View style={style.divider} ></View>
          
          <Text text='Call Duration' type='h4' style={{ color: BLUE, marginVertical: 30 }} />
          <View style={style.buttons} >
            <TouchableNativeFeedback onPress={() => this.onChangeActive('incoming')} >
              <View style={[style.button, this.state.activeType === 'incoming' ? style.active : null]} >
                <Text text='Incoming Call' type='h6' style={this.state.activeType === 'incoming' ? { color: '#fff' } : null} />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this.onChangeActive('outgoing')} >
              <View style={[style.button, this.state.activeType === 'outgoing' ? style.active : null]} >
                <Text text='Outgoing Call' type='h6' style={this.state.activeType === 'outgoing' ? { color: '#fff' } : null} />
              </View>
            </TouchableNativeFeedback>
          </View>
          {active}
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
              <Text text='Call Logs' type='h3' style={{ color: BLUE }} />
            </View>
            <View style={style.icon} >
              <Icon name={CALL} size={30} color={'#000'} />
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
  },
  divider: {
    width: '80%',
    borderWidth: 1,
    borderColor: GRAY2,
    alignSelf: 'center'
  },
  buttons: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BLUE,
    flexDirection: 'row'
  },
  button: {
    width: '50%',
    height: '100%',
    justifyContent: 'center'
  },
  active: {
    backgroundColor: BLUE
  },
  lengends: {
    // width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10
  },
  lengend: {
    marginHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginRight: 5
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

export default connect(mapStateToProps, mapDispatchToProps)(CallLogs);