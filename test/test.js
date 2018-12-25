const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();


const Recipe = require('../db/models/Recipe');

describe('Recipe', () => {
  describe('Adding a recipe', () => {
    it('should save without error', async () => {
      const newRecipe = await Recipe.add('borscht', 100);      
      newRecipe.should.be.an.instanceOf(Recipe);
    });
  });
});
