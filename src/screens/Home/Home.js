import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Emoji from 'react-native-emoji';
import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/dist/Feather';
import AsyncStorage from '@react-native-community/async-storage';

import Text from '../../components/UI/Text/Text';
import ScoreBoard from '../../components/ScoreBoard/ScoreBoard';
import Loading from '../../components/UI/Loading/Loading';
import { LIGHT_BLUE_CHART, BLUE, PURPLE } from '../../util/color';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import { ALERT } from '../../util/icons';
import { getScore, resetError, setScore } from '../../store/actions/index';

class Home extends Component {
  
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      this.props.onResetError();
    });
    // this.getScore();
    AsyncStorage.getItem('score')
      .then(score => {
        score = JSON.parse(score);
        if(score.score) {
          this.props.onSetScore(score.score, null, score.startDay, score.endDay);
        } else {
          this.getScore();
        }
      })
      .catch(e => {
        this.getScore();
      });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getScore = () => {
    this.props.onResetError();
    this.props.onGetScore(this.props.token);
  }
  render() {
    let ren = null;
    let error = (
      <View style={{ marginTop: Dimensions.get('screen').height / 5}} >
        <Icon name={ALERT} size={45} color={PURPLE} style={{ alignSelf: 'center', marginBottom: 20 }} />
        <Text text={this.props.error} />
        <View style={{ width: 150, height: 40, alignSelf: 'center', marginVertical: 25 }} >
          <Button text='Retry' onPress={this.getScore} />
        </View>  
      </View>
    );
    const loading = (
      <View style={{ marginTop: Dimensions.get('screen').height / 5 }} >
        <Loading />
      </View>
    );
    if(this.props.error) {
      ren = error;
    } else if(this.props.loading) {
      ren = loading;
    } else if(this.props.score) {
      if(this.props.score.score) {
        ren = (
          <ScoreBoard score={this.props.score.score} onPress={this.getScore} />
        );
      } else {
        ren = (
          <View style={{ marginTop: Dimensions.get('screen').height / 7 }} >
            <Spinner isVisible type='Pulse' style={{ alignSelf: 'center', marginBottom: 30 }} />
            <Text text='Score will be Available After' type='h5' style={{ marginBottom: 15 }} />
            <CountDown
              until={this.props.score.time ? ((this.props.score.time - new Date().getTime()) / 1000) : (60 * 60)}
              onFinish={() => alert('finished')}
              size={30}
              digitStyle={{ backgroundColor: LIGHT_BLUE_CHART }}
              digitTxtStyle={{ color: BLUE }}
              timeLabelStyle={{ fontFamily: 'Rubik-Light', color: '#000', fontSize: 15 }}
            />
          </View>
        );
      }
    }  
    if(this.props.profile) {
      return (
        <ScrollView style={{ backgroundColor: '#fff' }} >
          <View style={style.header} >
            <View style={{ height: '100%', justifyContent: 'center', width: '70%' }} >
              <Text 
                text={`Hi, ${this.props.profile.userName}!`}
                type='h3'
                numberOfLines={1}
                style={{ textAlign: 'left', fontFamily: 'Rubik-Medium' }}
              />
            </View>
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', width: '30%' }} >
              <Emoji name={this.props.profile.profile.profileEmoji} style={{fontSize: 50}} />
            </View>
          </View>
          {ren}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

const style = StyleSheet.create({
  header: {
    width: '90%',
    height: 90,
    // backgroundColor: 'red',
    alignSelf: 'center',
    flexDirection: 'row',
  }
});

const mapStateToProps = state => {
  return {
    profile: state.auth.data,
    token: state.auth.token,
    score: state.score,
    loading: state.loading.loading,
    error: state.error.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGetScore: (token) => dispatch(getScore(token)),
    onResetError: () => dispatch(resetError()),
    onSetScore: (score, time, startDay, endDay) => dispatch(setScore(score, time, startDay, endDay))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);