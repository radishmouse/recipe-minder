const Model = require('./base');

class Recipe extends Model {
  constructor(id, name, servings) {
    super(Recipe);

    this.id = id;
    this.name = name;
    this.servings = servings;
  }

  // moved to base model
  // static convertMultiple(recipes) {
  //   return recipes.map(r => new Recipe(r.id, r.name, r.servings));
  // }
  
  static add(name, servings) {
    return this.db.one({
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

  static get(id) {
    return this.db.one(`
      select * from recipes where id=$1
    `, [id]).then(r => new Recipe(id, r.name, r.servings));
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
    return this.db.any(`
        select * from recipes
        where
          name ilike '%$1:raw%'
      `, [searchText])   
      .then(this.convertMultiple);
  }

  static searchByServings(howMany, threshold=1) {
    // Find a Recipe that provides =howMany= servings
    return this.db.any(`
      select * from recipes 
        where 
      servings > ($1 - $2) and servings < ($1 + $2)
    `, [howMany, threshold]).then(this.convertMultiple);
  }

  static searchByIngredient(ingredientName){
    return this.db.any(`
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
    return this.db.any(`
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

  static searchByTag(tagName) {
    return this.db.any(`
      select *
        from recipes
      where id in (
        select recipe_id
          from recipes_tags
        where tag_id in (
              select id
                from tags
              where name ilike '%$1:raw%'
          )
      )
    `, [tagName])
      .then(this.convertMultiple);
  }

  static delete(id) {
    return this.db.result(`
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

  getIngredientAmounts() {
    // return array of ingredients and amounts
  }

  get steps() {
    // return db.any()
  }

  set step(step) {

    // if ()
    
    // given a Step 
    
    // get last order number of existing steps
    // insert this step, setting its order number


    // update a step in place
    // if its order number has changed, update other steps to
    // accommodate.
  }

  addIngredientAmount(ingredient, quantity, measurement) {
    // find or create the ingredient
    // using its id, add to the amounts table using this.id
    
  }

  update(id, newName, newServings) {
    return this.db.result(`
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
  
}

module.exports = Recipe;
