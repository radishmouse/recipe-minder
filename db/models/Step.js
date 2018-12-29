const Model = require('./base');

class Step extends Model {
  constructor(
    id,
    description,
    step_number,
    recipe_id,
    version_number=1
  ) {
    super();
    
    this.id = id;
    this.description = description;
    this.step_number = step_number;
    this.version_number = version_number;
    this.recipe_id = recipe_id;
  }

  static add(
    description,
    step_number,
    recipe_id,
    version_number=1    
  ) {
    return this.convertFromQuery(
      this.db.one({
        name: 'add-step-for-recipe',
        text: `
        insert into steps
          (
            description,
            step_number,
            recipe_id,
            version_number
           )
        values
          ($1, $2, $3, $4)
        returning 
          id,
          description,
          step_number,
          recipe_id,
          version_number
      `,
        values: [
          description,
          step_number,
          recipe_id,
          version_number
        ]
      }));    
  }

  static get(id) {
    return this.convertFromQuery(
      this.db.one(`
        select * from steps where id=$1
      `, [id]));
  }
  
  save() {
    if (this.id) {
      // compare this description and step_number
      return Step.get(this.id)
        .then(step => {
          if (
            step.description === this.description
              && step.step_number === this.step_number) {
            // no need to update
            return this;
          } else {
            return Step.db.result(`
              update steps 
                set 
                  description = $2,
                  step_number = $3,
                  version_number = $4
              where id=$1
            `, [this.id, this.description, this.step_number, this.version_number + 1])
              .then(({rowCount}) => {
                if (rowCount !== 1) {
                  return 0;
                } else {
                  return this.id;
                }
              });    
            
          }
        });
    } else {
      // run an add
      return Step.add(this.description, this.step_number, this.recipe_id, this.version_number);
    }
    
  }
  
  static forRecipe(recipe_id) {
    return this.convertFromQuery(
      this.db.any(`
        select * from steps where recipe_id = $1
        order by step_number
      `, [recipe_id])
    );
  }
}

module.exports = Step;
