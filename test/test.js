const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();


const Recipe = require('../db/models/Recipe');

describe('Recipe', () => {

  describe('#add() and #delete()', () => {
    it('should add and delete without error', async () => {
      const newRecipe = await Recipe.add('borscht', 100);
      newRecipe.should.be.an.instanceOf(Recipe);
      Recipe.delete(newRecipe.id).should.eventually.equal(newRecipe.id);      
    });
  });
  
  describe('#get()', () => {      
    it('should be an instance for a valid id', async () => {
      const instance = await Recipe.get(1);
      instance.should.be.an.instanceOf(Recipe);      
    });

    it('should reject for an invalid id', () => {
      return Recipe.get(9999).should.eventually.be.rejected; 
    });
  });

  describe('#byName()', () => {
    it('should be an array of instances for a valid name', async () => {
      const instances = await Recipe.byName('steak');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));
    });
    it('should be an empty array for an invalid name', async () => {
      const instances = await Recipe.byName('asdfasfdasljf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byServings()', () => {
    it('should be an array of instances for a valid number of servings', async () => {
      const instances = await Recipe.byServings(4);
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should be an empty array for an invalid number of servings', async () => {
      const instances = await Recipe.byServings(99999);
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byIngredient()', () => {
    it('should be an array of instances for a valid ingredient', async () => {
      const instances = await Recipe.byIngredient('ground beef');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should be an empty array for an invalid ingredient', async () => {
      const instances = await Recipe.byIngredient('asdfadsfsadf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byTag()', () => {
    it('should be an array of instances for a valid tag', async () => {
      const instances = await Recipe.byTag('party');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should be an empty array for an invalid tag', async () => {
      const instances = await Recipe.byTag('asdfadsfsadf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#older()', () => {
    it('should be an array of instances', async () => {
      const instances = await Recipe.older();
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
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
