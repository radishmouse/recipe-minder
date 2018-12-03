const db = require('../conn');

class Recipe {
  constructor(id, name, servings) {
    this.id = id;
    this.name = name;
    this.servings = servings;
  }

  static convertMultiple(recipes) {
    return recipes.map(r => new Recipe(r.id, r.name, r.servings));
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
      .then(this.convertMultiple);
  }

  static searchByServings(howMany, threshold=1) {
    // Find a Recipe that provides =howMany= servings
    return db.any(`
      select * from recipes 
        where 
      servings > ($1 - $2) and servings < ($1 + $2)
    `, [howMany, threshold]).then(this.convertMultiple);
  }

  static searchByIngredient(ingredientName){
    return db.any(`
      select * from recipes 
        where 
      id in (
        select recipe_id from amounts 
          where 
        ingredient_id in (
          select id from ingredients where name ilike '%$1:raw%'
        )
      )
    `, [ingredientName])
      .then(this.convertMultiple);
  }
}

module.exports = Recipe;
