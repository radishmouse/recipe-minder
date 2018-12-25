const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();


const Recipe = require('../db/models/Recipe');

describe('Recipe', () => {
  describe('Adding/removing a recipe', () => {
    it('should add and delete without error', async () => {
      const newRecipe = await Recipe.add('borscht', 100);
      newRecipe.should.be.an.instanceOf(Recipe);
      Recipe.delete(newRecipe.id).should.eventually.equal(newRecipe.id);      
    });
  });
  describe('Adding steps to a recipe', () => {
    const steps = [
      'heat skillet',
      'put butter in skillet',
      'grill inside of bread for 1 minute in pan',
      'add more butter to skillet',
      'flip one slice bread over',
      'take out other slice of bread',
      'put cheese on one side of bread',
      'put second slice of bread on top of cheese',
      'press flat wth spatula',
      'grill each side for 2 minutes'
    ];

    // it('should add steps without error', async () => {
      
    // });

  });
});
