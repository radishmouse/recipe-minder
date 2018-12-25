const chai = require('chai');
const expect = chai.expect;
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
  
  describe('Can retrieve Recipe instances', () => {
    describe('getById', () => {      
      it('should be an instance for a valid id', async () => {
        const instance = await Recipe.get(1);
        instance.should.be.an.instanceOf(Recipe);      
      });

      it('should reject for an invalid id', () => {
        return Recipe.get(9999).should.eventually.be.rejected; 
      });
    });

    describe('searchByName', () => {
      it('should be an array of instances for a valid name', async () => {
        const instances = await Recipe.searchByName('steak');
        instances.should.be.an('array');
        instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));
      });
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
