const Model = require('./base');
const Step = require('./Step');

class Recipe extends Model {
  constructor(id, name, servings) {
    super();
    
    this.id = id;
    this.name = name;
    this.servings = servings;
  }

  static add(name, servings) {
    return this.convertFromQuery(
      this.db.one({
        name: 'add-recipe',
        text: `
        insert into recipes
          (name, servings)
        values
          ($1, $2)
        returning id, name, servings
      `,
        values: [name, servings]
      }));
  }

  static get(id) {
    return this.convertFromQuery(
      this.db.one(`
        select * from recipes where id=$1
      `, [id]));
  }
  
  static byName(searchText) {
    return this.convertFromQuery(this.db.any(`
        select * from recipes
        where
          name ilike '%$1:raw%'
      `, [searchText]));

  }

  static byServings(howMany, threshold=1) {
    // Find a Recipe that provides =howMany= servings
    return this.convertFromQuery(this.db.any(`
      select * from recipes 
        where 
      servings > ($1 - $2) and servings < ($1 + $2)
    `, [howMany, threshold]));
  }

  static byIngredient(ingredientName){
    return this.convertFromQuery(this.db.any(`
      select * from recipes 
        where 
      id in (
        select recipe_id from amounts 
          where 
        ingredient_id in (
          select id from ingredients where name ilike '%$1:raw%'
        )
      )
    `, [ingredientName]));

  }

  static byTag(tagName) {
    return this.convertFromQuery(this.db.any(`
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
    `, [tagName]));

  }

  static older(howMany=5) {
    console.log('\nTODO: use joins so we can see what date it was last made on');
    console.log('\nTODO: let `older` be a modifier for other searches');
    return this.convertFromQuery(this.db.any(`
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
    `, [howMany]));
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
    return Step.forRecipe(this.id);
  }

  set steps(stepsArray) {

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
