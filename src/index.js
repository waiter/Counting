import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BindComponent from './components/BindComponent';
import Constant from './data/constant';
import { AdMobBanner} from 'react-native-admob';
import Sound from './sound';

const colorLen = Constant.colors.length;
const colors = Constant.colors[parseInt(Math.random() * colorLen, 10)];
// const colors = Constant.colors[5];

class Counting extends BindComponent {
  constructor(props) {
    super(props, ['addPoint', 'deletePoint', 'restart', 'getTexts']);
    this.state = {
      nowCount: 0,
      lastCounts: [],
      actions: [],
    };
    StatusBar.setBarStyle(colors.topBar, 'fade');
    Sound.init();
  }

  addPoint() {
    Sound.playWithPool(Constant.sounds.add);
    const {nowCount, actions} = this.state;
    const newAction = Object.assign([], actions);
    newAction.push(1);
    this.setState({
      nowCount: nowCount+1,
      actions: newAction,
    });
  }

  deletePoint() {
    const {nowCount, actions} = this.state;
    if (nowCount > 0) {
      Sound.playWithPool(Constant.sounds.delete);
      const newAction = Object.assign([], actions);
      newAction.push(-1);
      this.setState({
        nowCount: nowCount-1,
        actions: newAction,
      });
    } else {
      Sound.playWithPool(Constant.sounds.deleteNone);
      console.log('no no no');
    }
  }

  restart() {
    Sound.playWithPool(Constant.sounds.restart);
    const {nowCount, lastCounts} = this.state;
    let nc = Object.assign([], lastCounts);
    if (nowCount > 0) {
      nc.push(nowCount);
    }
    this.setState({
      lastCounts: nc,
      actions: [],
      nowCount: 0
    });
  }

  getTexts(arr, type) {
    const len = arr.length > Constant.maxItem ? Constant.maxItem : arr.length;
    const newArr = Array.from(arr.reverse());
    arr.reverse();
    const texts = [];
    for(let i = 0; i < len; i++) {
      const opacity = 1.0 * (len - i) / len;
      if (type == 0) {
        texts.push(<Text key={i} style={[styles.hisText, {opacity}]}>{newArr[i]}</Text>);
      } else {
        const color = newArr[i] > 0 ? colors.add : colors.delete;
        texts.push(<Text key={i} style={[styles.hisText, {opacity, color}]}>{newArr[i] > 0 ? '+1' : '-1'}</Text>);
      }
    }
    return texts.reverse();
  }

  render() {
    const {nowCount, lastCounts, actions} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.show}>
          <View style={styles.leftView}>
            {this.getTexts(lastCounts, 0)}
          </View>
          <View style={styles.middleView}>
            <Text style={styles.middleText}>{nowCount}</Text>
          </View>
          <View style={styles.rightView}>
            {this.getTexts(actions, 1)}
          </View>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity style={styles.restart} onPress={this.restart}>
            <View>
              <Icon name="replay" size={100} color={colors.action} />
            </View>
          </TouchableOpacity>
          <View style={styles.container}>
            <TouchableOpacity style={styles.add} onPress={this.addPoint}>
              <View>
                <Icon name="add" size={100} color={colors.action} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.delete} onPress={this.deletePoint}>
              <View>
                <Icon name="remove" size={100} color={colors.action} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AdMobBanner
          bannerSize="smartBannerPortrait"
          testDeviceID={Constant.testDeviceID}
          adUnitID={Constant.adKey}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.showBg,
  },
  leftView: {
    // flex: 0.5,
    width: 90,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  rightView: {
    width: 90,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  middleView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hisText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.showNum,
  },
  middleText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.showNum,
  },
  show: {
    flex: 1,
    flexDirection: 'row',
  },
  btns: {
    flex: 1,
    flexDirection: 'row',
  },
  restart: {
    flex: 0.5,
    backgroundColor: colors.restart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    flex: 1,
    backgroundColor: colors.add,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    flex: 1,
    backgroundColor: colors.delete,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Counting;
