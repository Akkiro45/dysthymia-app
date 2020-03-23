import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';

import LineChart from '../../../components/UI/LineChart/LineChart';
import Text from '../../../components/UI/Text/Text';
import { STEP, DOUBLE_LEFT_ARROW, DOUBLE_RIGHT_ARROW } from '../../../util/icons';
import { BLUE, GRAY1, GRAY2, PURPLE, LIGHT_BLUE_CHART } from '../../../util/color';
import { calcCalories, calcDistance, kRespresentedStr } from '../../../util/util';
import { fetchStats, resetError, cleanStats } from '../../../store/actions/index';
import Loading from '../../../components/UI/Loading/Loading';

class StepsCounter extends Component {
  state = {
    refreshing: false,
    page: 1,
    finished: -1,
    data: null,
    stats: null,
    total: 0,
    currCount: 0,
    currDate: '',
    endTarget: 5000
  }
  componentDidMount() {
    this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'stepCounter', this.props.token, this.props.route.params.initialData);
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

  getEndTarget = (curr) => {
    let endTarget = 5000;
    while(curr > endTarget) {
      endTarget += 5000;
    }
    return endTarget;
  }

  setData = (page, stats, isFinished) => {
    const start = (page - 1) * 7;
    const end = page * 7;
    stats = stats.slice(start, end);
    stats = stats.reverse();
    if(stats.length < 7 && !isFinished) {
      this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'stepCounter', this.props.token);
    } else {
      let labels = [];
      let dataPoints = [];
      let total = 0;
      let count;
      let l = stats.length;
      let finished = this.state.finished;

      stats.forEach(el => {
        labels.push(el.day);
        count = el.steps ? el.steps : 0;
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
        currCount: stats[l-1].steps ? stats[l-1].steps : 0, 
        currDate: this.getTimeLabel(stats[l-1]),
        endTarget: this.getEndTarget(stats[l-1].steps),
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
      currDate: '',
      endTarget: 5000
    });
    this.props.onFetchStatsStart(1, this.props.pageSize, 'stepCounter', this.props.token, this.props.route.params.initialData);
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
          <Text text={`${this.state.currCount}`} type='h1' style={{ marginVertical: 30, fontFamily: 'Rubik-Medium', color: BLUE, fontSize: 45 }} />
          
          <View style={{ width: Dimensions.get('screen').width - 50, alignSelf: 'center', flexDirection: 'row' }} >
            <Text text='0' style={[style.light, { textAlign: 'left', width: '25%', fontSize: 15 }]} />
            <Text text={this.state.endTarget} style={[style.light, { textAlign: 'right', width: '75%', fontSize: 15 }]} />
          </View>
          <Progress.Bar 
            progress={this.state.currCount / this.state.endTarget} 
            width={Dimensions.get('screen').width - 60} 
            height={8}
            style={{ alignSelf: 'center' }}
            borderWidth={0}
            unfilledColor={LIGHT_BLUE_CHART}
            color={BLUE}
            borderRadius={6}
          />
          
          <Text text='Steps Taken' type='h4' style={{ marginVertical: 20 }} />
          <View style={style.detail} >
            <View style={style.detailItem} >
              <Text text='Distance' type='h5' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                <View >
                  <Text text={calcDistance(this.state.currCount, this.props.route.params.initialData.height)} type='h5'  />
                </View>
                <View style={{ height: 30, justifyContent: 'center', marginLeft: 5 }} >
                  <Text text='km' type='h6' style={style.light} />
                </View>
              </View>
            </View>
            <View style={style.detailItem} >
              <Text text='Calories' type='h5' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                <View >
                  <Text text={kRespresentedStr(calcCalories(this.state.currCount, this.props.route.params.initialData.weight, this.props.route.params.initialData.height))} type='h5'  />
                </View>
                <View style={{ height: 30, justifyContent: 'center', marginLeft: 5 }} >
                  <Text text='cal' type='h6' style={style.light} />
                </View>
              </View>
            </View>
          </View>

          <LineChart 
            data={this.state.data}
            onDataPointClick={(data) => {
              this.setState({ 
                currCount: this.state.stats[data.index].steps ? this.state.stats[data.index].steps : 0, 
                currDate: this.getTimeLabel(this.state.stats[data.index]),
                endTarget: this.getEndTarget(this.state.stats[data.index].steps)
              })
            }}
          />
          
          <Text text={`${this.state.total} steps this week!`} type='h5' style={{ marginVertical: 20, fontFamily: 'Rubik-Light' }} />
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
              <Text text='Steps Counter' type='h3' style={{ color: BLUE }} />
            </View>
            <View style={style.icon} >
              <Icon1 name={STEP} size={30} color={'#000'} />
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
  detail: {
    width: '90%',
    height: 150,
    borderTopWidth: 1,
    borderTopColor: GRAY2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  detailItem: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  light: { 
    fontFamily: 'Rubik-Light', 
    fontSize: 12, 
    opacity: 0.5 
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

export default connect(mapStateToProps, mapDispatchToProps)(StepsCounter);