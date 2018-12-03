const db = require('../conn');

class Recipes {
  constructor(id, name, servings) {
    this.id = id;
    this.name = name;
    this.servings = servings;
  }

  static add(name, servings) {
    return db.one({
      name: 'add-recipe',
      text: `
        insert into recipes
          (name, servings)
        values
          ($1, $2)
        returning id
      `,
      values: [name, servings]
    }).then(newRecord => new Recipes(newRecord.id, name, servings));    
  }

  static searchByName(searchText) {
    // return db.any({
    //   name: 'search-recipes-by-name',
    //   text: `
    //     select * from recipes
    //     where
    //       name ilike '%$1:raw%'
    //   `,
    //   values: [searchText]
    // })
    return db.any(`
        select * from recipes
        where
          name ilike '%$1:raw%'
      `, [searchText])   
      .then(records => records.map(r => new Recipes(r.id, r.name, r.servings)));
  }

  static searchByServings() {
    
  }
}

module.exports = Recipes;
