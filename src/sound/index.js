import Sound from 'react-native-sound';
import Constant from '../data/constant';
import Pool from '../kit/Pool';

const ss = {
  isInit: false,
  soundMap: {},
  init: async function() {
    try {
      const keys = Object.keys(Constant.sounds);
      const len = keys.length;
      for(let i = 0; i< len; i++) {
        // ss.soundMap[Constant.sounds[keys[i]]] = await ss.createSound(Constant.sounds[keys[i]]);
        ss.soundMap[Constant.sounds[keys[i]]] = await Pool.createNew(ss.createSound.bind(ss, Constant.sounds[keys[i]]), 1);
      }
      ss.isInit = true;
      console.log(ss.soundMap);
    } catch (e) {
      console.log(e);
    }
  },
  play: function(key) {
    const so = ss.soundMap[key];
    if (ss.isInit && so) {
      so.play();
    } else {
      console.log('sound is not ready');
    }
  },
  playRealtime: async function(key) {
    try {
      const so = await ss.createSound(key);
      so.play();
    } catch (e) {
      console.log('playRealtime:' + e.toString());
    }
  },
  playWithPool: async function(key) {
    const pool = ss.soundMap[key];
    if (pool) {
      const so = await pool.getFreeOne();
      if (so) {
        so.play(() => pool.freeOne(so));
      } else {
        console.log('Can get free sound:' + key);
      }
    } else {
      console.log('no pool: ' + key);
    }
  },
  createSound: function(key) {
    return new Promise(async function(resolve, reject) {
      const s = new Sound(key, Sound.MAIN_BUNDLE, e => {
        if (e) {
          reject(e);
        } else {
          resolve(s);
        }
      });
    });
  },
};

export default ss;
