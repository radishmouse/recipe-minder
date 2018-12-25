const dbConn = require('../conn');

class Model {
  // constructor(self) {
  //   // grrr... can't do static properties in this version of Node...
  // }
  
  static get db() {
    return dbConn;
  }  
}

// Explicitly not using arrow function, for variable `this`
Model.convertFromQuery = function (val) {
  return val.then(r => this.toInstance(r));
};

// Explicitly not using arrow function, for variable `this`
Model.toInstance = function (result) {
  if (Array.isArray(result)) {

    // Duplicate code so that `new this` works correctly.
    return result.map(r => {
      const instance = new this();

      Object.keys(r).forEach(k => {
        instance[k] = r[k];
      });
      return instance;
    });
    
  } else {
    // Duplicate code so that `new this` works correctly.
    const instance = new this();
    Object.keys(result).forEach(k => {
      instance[k] = result[k];
    });
    return instance;        
  }
};

module.exports = Model;
