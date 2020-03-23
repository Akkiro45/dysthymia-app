import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/Fontisto';
import { connect } from 'react-redux';
import Pie from 'react-native-pie';

import Text from '../../../components/UI/Text/Text';
import { GRID, LEFT_ARROW, RIGHT_ARROW } from '../../../util/icons';
import { minToTime } from '../../../util/util';
import { BLUE, GRAY1, GRAY2, PURPLE, PURPLE_CHART, GREEN_CHART, YELLOW_CHART, BLUE_CHART, RED_CHART } from '../../../util/color';
import { fetchStats, resetError, cleanStats } from '../../../store/actions/index';
import Loading from '../../../components/UI/Loading/Loading';
import AppsList from '../../../components/Stats/AppsList/AppsList';

const COLORS = [YELLOW_CHART, GREEN_CHART, BLUE_CHART, RED_CHART, PURPLE_CHART];

class AppUsage extends Component {
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
    this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'usageStats', this.props.token, this.props.route.params.initialData);
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

  getPercentage = (type, appUsage) => {
    if(appUsage.topUsage[type]) {
      return ((appUsage.topUsage[type] * 100) / appUsage.total);
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
      this.props.onFetchStatsStart(this.props.pageNumber, this.props.pageSize, 'usageStats', this.props.token);
    } else {

      let data = [];
      let total = 0;
      let topTotal = 0;
      let temp;
      let topUsage;
      let isNotAvialbale = false;
      stats.forEach(el => {
        temp = {};
        total = 0;
        topTotal = 0;
        topUsage = {};
        isNotAvialbale = false;
        if(el.stats) {
          Object.keys(el.stats).forEach((key, i) => {
            if(i < 4) {
              topUsage[key] = el.stats[key];
              topTotal += el.stats[key];
            }
            total += el.stats[key];
          });
          topUsage['Other'] = total - topTotal;
          temp = el.stats;
        } else {
          isNotAvialbale = true;
        }
        data.push({ total, stats: temp, topUsage, isNotAvialbale });
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
    this.props.onFetchStatsStart(1, this.props.pageSize, 'usageStats', this.props.token, this.props.route.params.initialData);
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
      let content = null;
      if(this.state.data[this.state.currIndex].isNotAvialbale) {
        content = (
          <View style={{ width: '90%', alignSelf: 'center', marginTop: Dimensions.get('screen').height /5 }} >
            <Text text='Sorry!' type='h4' style={{ color: PURPLE, marginVertical: 20 }} />
            <Text text='No Data Available!' type='h5' />
          </View>
        );
      } else {
        content = (
          <View>
            <Text text={minToTime(this.state.data[this.state.currIndex].total)} type='h4' style={{ marginTop: 20 }} />
            <View style={style.chart}>
              <Pie
                radius={90}
                innerRadius={80}
                sections={
                  Object.keys(this.state.data[this.state.currIndex].topUsage).map((key, i) => {
                    return {
                      percentage: this.getPercentage(key, this.state.data[this.state.currIndex]),
                      color: COLORS[i],
                    }
                  })
                  }
                dividerSize={0}
                strokeCap={'butt'}
              />
            </View>
            <View style={{ width: '80%', borderWidth: 1, borderColor: GRAY2, alignSelf: 'center' }} ></View>
            <AppsList appUsage={this.state.data[this.state.currIndex]}   />
          </View>
        );
      }
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
          {content}
          
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
              <Text text='App Usage' type='h3' style={{ color: BLUE }} />
            </View>
            <View style={style.icon} >
              <Icon1 name={GRID} size={30} color={'#000'} />
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
    marginVertical: 30
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

export default connect(mapStateToProps, mapDispatchToProps)(AppUsage);