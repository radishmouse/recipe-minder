const dbConn = require('../conn');

class Model {
  constructor(self) {
    this.self = self;

    // grrr... can't do static properties in this version of Node...
    this.convertMultiple = (items) => {
      return items.map(function(r) {
        const instance = new this();
        Object.keys(r).forEach(k => {
          instance[k] = r[k];
        });
        return instance;
      });
    };  
    
  }
  
  static get db() {
    return dbConn;
  }
  
}

module.exports = Model;
