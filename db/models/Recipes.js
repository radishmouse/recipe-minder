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
    }).then(newRecord => new Recipe(newRecord.id, name, servings));    
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

  static searchOlder(howMany=5) {
    console.log('TODO: use joins so we can see what date it was last made on');
    return db.any(`
      select * from recipes 
        where 
      id in (
        select meal_id from recipes_meals 
          where 
        recipe_id in (
          select id from meals 
            order by made_on, id asc 
          limit $1
        )
      )
    `, [howMany])
    .then(this.convertMultiple);
  }

  update(id, newName, newServings) {
    return db.result(`
      update recipes set
        name=$2,
        servings=$3
      where id=$1
    `, [id, newName, newServings])
    .then(({rowCount}) => {
      if (rowCount !== 1) {
        return 0;
      } else {
        return id;
      }
    });
  }

  static delete(id) {
    return db.result(`
      delete from recipes where id=$1
    `, [id])
    .then(({rowCount}) => {
      if (rowCount !== 1) {
        return 0;
      } else {
        return id;
      }
    });    
  }
}

module.exports = Recipe;
