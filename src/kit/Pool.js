
const Pool = {
  createNew:  async function(createFunc, initCount) {
    const pool = {
      free: [],
      busy: [],
      createFunc,
    };
    pool.freeOne = function(obj) {
      const ind = pool.busy.indexOf(obj);
      if (ind > -1) {
        pool.busy.splice(ind, 1);
        pool.free.push(obj);
      } else {
        console.log('Pool: can not find item');
      }
    };
    pool.getFreeOne = async function() {
      let fo;
      if (pool.free.length > 0) {
        fo = pool.free.shift();
      } else {
        if (pool.createFunc) {
          fo = await pool.createFunc();
        }
      }
      if (fo) {
        pool.busy.push(fo);
      }
      return fo;
    };
    for(let i = 0; i< initCount; i++) {
      const temp = await createFunc();
      pool.free.push(temp);
    }
    return pool;
  }
};

export default Pool;
