import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Pie from 'react-native-pie';

import Text from '../../../components/UI/Text/Text';
import { ACTIVITY, LEFT_ARROW, RIGHT_ARROW } from '../../../util/icons';
import { capitalizeFirstChar } from '../../../util/util';
import { BLUE, GRAY1, PURPLE, PURPLE_CHART, GREEN_CHART, YELLOW_CHART, BLUE_CHART, RED_CHART } from '../../../util/color';
import { fetchStats, resetError, cleanStats } from '../../../store/actions/index';
import Loading from '../../../components/UI/Loading/Loading';

const chartColors = {
  TILTING: YELLOW_CHART,
  STILL: GREEN_CHART,
  WALKING: BLUE_CHART,
  RUNNING: RED_CHART,
  IN_VEHICLE: PURPLE_CHART,
  UNKNOWN: GRAY1,
}

class Activities extends Component {
  state = {
    refreshing: false,
    page: 1,
    displayPage: 1,
    finished: -1,
    data: null, 
    stats: null,
    currIndex: 0,
    currDate: ''
  }
  componentDidMount() {
    this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'activities', this.props.token, this.props.route.params.initialData);
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

  getPercentage = (type, activities) => {
    if(activities.total === 0) {
      if(type === 'UNKNOWN') return 100;
      else return 0;
    }
    if(activities.activities[type]) {
      return ((activities.activities[type] * 100) / activities.total);
    } else {
      return 0;
    }
  }

  setData = (page, stats, isFinished, isRightOp) => {
    const start = (page - 1) * 7;
    const end = page * 7;
    stats = stats.slice(start, end);
    stats = stats.reverse();
    if(stats.length < 7 && !isFinished) {
      this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'activities', this.props.token);
    } else {

      let data = [];
      let total = 0;
      let temp;
      
      stats.forEach(el => {
        temp = {};
        total = 0;
        if(el.stats) {
          Object.keys(el.stats).forEach(key => {
            Object.keys(el.stats[key]).forEach(e => {
              if(e === 'IN_VEHICLE' || e === 'STILL' || e === 'TILTING' || e === 'UNKNOWN' || e === 'WALKING' || e === 'RUNNING') {
                total += el.stats[key][e];
                if(temp[e]) {
                  temp[e] += el.stats[key][e];
                } else {
                  temp[e] = el.stats[key][e];
                }
              }
            });
          });
        }
        data.push({ total, activities: temp });
      });

      let l = stats.length;
      let finished = this.state.finished;
      let curr = l-1;
      if(isRightOp) {
        curr = 0;
      }
      if((isFinished && this.state.displayPage === 1) && stats.length === 1 ) {
        finished = 1;
      }
      this.setState({ 
        stats, 
        data,
        currDate: this.getTimeLabel(stats[curr]), 
        currIndex: curr,
        finished 
      });
    }
  }

  onRefresh = () => {
    this.props.onCleanStats();
    this.props.onResetError();
    this.setState({
      page: 1,
      displayPage: 1,
      finished: -1,
      data: null,
      stats: null,
      currDate: '',
      currIndex: 0
    });
    this.props.onFetchStatsStart(1, this.props.pageSize, 'activities', this.props.token, this.props.route.params.initialData);
  }

  onChangePage = (type) => {

    let page = this.state.page;
    let currIndex = this.state.currIndex;
    let currDate = this.getTimeLabel(this.state.stats[currIndex]);
    let displayPage = this.state.displayPage;
    let finished = this.state.finished;
    let isRightOp = false;

    if(type === 'left') {
      displayPage = displayPage + 1;
      currIndex = currIndex - 1;
    } else if(type === 'right') {
      displayPage = displayPage - 1;
      currIndex = currIndex + 1;
      isRightOp = true;
    }

    if((this.props.isFinished && currIndex === 0) && this.state.stats.length < 7 ) {
      finished = displayPage;
    }

    if(this.state.stats[currIndex]) {
      currDate = this.getTimeLabel(this.state.stats[currIndex]);
      this.setState({ currDate, currIndex, displayPage, finished });
    } else {
      if(type === 'left') {
        page = page + 1;
      } else if(type === 'right') {
        page = page - 1;
      }
      this.setData(page, this.props.stats, this.props.isFinished, isRightOp);
      this.setState({ page });
    }
  }
  
  render() {
    let ren = null;
    const leftArrow = (
      <View style={style.arrow} >
        <Icon name={LEFT_ARROW} size={30} color={this.state.displayPage === this.state.finished ? GRAY1 : '#000'} />
      </View>
    );
    const rightArrow = (
      <View style={style.arrow} >
        <Icon name={RIGHT_ARROW} size={30} color={this.state.displayPage === 1 ? GRAY1 : '#000'} />
      </View>
    );
    if((!this.props.loading && this.props.stats.length > 0) && this.state.data ) {
      ren = (
        <View>
          <View style={style.controls} >
            {this.state.displayPage === this.state.finished ? leftArrow : (
              <TouchableWithoutFeedback onPress={() => this.onChangePage('left')} >
                {leftArrow}
              </TouchableWithoutFeedback>
            )}
            <View style={[style.arrow, { width: '40%' }]} >
              <Text text={this.state.currDate} style={{ fontFamily: 'Rubik-Medium' }} numberOfLines={1} />
            </View>
            {this.state.displayPage === 1 ? rightArrow : (
              <TouchableWithoutFeedback onPress={() => this.onChangePage('right')} >
                {rightArrow}
              </TouchableWithoutFeedback>
            )}
          </View>
          <Text text='Activities' type='h4' style={{ marginTop: 20 }} />
          <View style={style.chart}>
            <Pie
              radius={90}
              innerRadius={80}
              sections={
                Object.keys(chartColors).map(key => {
                  return {
                    percentage: this.getPercentage(key, this.state.data[this.state.currIndex]),
                    color: chartColors[key],
                  }
                })
                }
              dividerSize={0}
              strokeCap={'butt'}
            />
          </View>
          <View style={style.lengends} >
            {
              Object.keys(chartColors).map(key => {
                return (
                  <View style={style.lengend} key={key} >
                    <View style={[style.dot, { backgroundColor: chartColors[key] }]} ></View>
                    <View>
                      <Text text={capitalizeFirstChar(key)} type='h5' style={{ fontSize: 18 }} />
                    </View>
                  </View>
                )
              })
            }
          </View>
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
              <Text text='Activity' type='h3' style={{ color: BLUE }} />
            </View>
            <View style={style.icon} >
              <Icon1 name={ACTIVITY} size={30} color={'#000'} />
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
  chart: {
    alignSelf: 'center',
    marginVertical: 50
  },
  lengends: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }, 
  lengend: {
    width: '50%',
    height: 25,
    flexDirection: 'row',
    marginVertical: 10
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: GRAY1,
    marginTop: 2,
    marginRight: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(Activities);