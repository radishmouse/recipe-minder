const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();


const Recipe = require('../db/models/Recipe');
const Step = require('../db/models/Step');

describe('Recipe', () => {

  describe('#add() and #delete()', () => {
    it('should add and delete without error', async () => {
      const newRecipe = await Recipe.add('borscht', 100);
      newRecipe.should.be.an.instanceOf(Recipe);
      Recipe.delete(newRecipe.id).should.eventually.equal(newRecipe.id);      
    });
  });
  
  describe('#get()', () => {      
    it('should return an instance for a valid id', async () => {
      const instance = await Recipe.get(1);
      instance.should.be.an.instanceOf(Recipe);      
    });

    it('should reject for an invalid id', () => {
      return Recipe.get(9999).should.eventually.be.rejected; 
    });
  });

  describe('#byName()', () => {
    it('should return an array of instances for a valid name', async () => {
      const instances = await Recipe.byName('steak');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));
    });
    it('should return an empty array for an invalid name', async () => {
      const instances = await Recipe.byName('asdfasfdasljf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byServings()', () => {
    it('should return  an array of instances for a valid number of servings', async () => {
      const instances = await Recipe.byServings(4);
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should return an empty array for an invalid number of servings', async () => {
      const instances = await Recipe.byServings(99999);
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byIngredient()', () => {
    it('should return an array of instances for a valid ingredient', async () => {
      const instances = await Recipe.byIngredient('ground beef');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should return an empty array for an invalid ingredient', async () => {
      const instances = await Recipe.byIngredient('asdfadsfsadf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#byTag()', () => {
    it('should return an array of instances for a valid tag', async () => {
      const instances = await Recipe.byTag('party');
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
    it('should return an empty array for an invalid tag', async () => {
      const instances = await Recipe.byTag('asdfadsfsadf');
      return instances.should.be.an('array').that.is.empty;
    });
  });

  describe('#older()', () => {
    it('should return an array of instances', async () => {
      const instances = await Recipe.older();
      instances.should.be.an('array');
      instances.forEach(i => expect(i).to.be.an.instanceOf(Recipe));      
    });
  });
    
  describe('Adding steps to a recipe', () => {
    const steps = [
      '0: heat skillet',
      '1: put butter in skillet',
      '2: grill inside of bread for 1 minute in pan',
      '3: add more butter to skillet',
      '4: flip one slice bread over',
      '5: take out other slice of bread',
      '6: put cheese on one side of bread',
      '7: put second slice of bread on top of cheese',
      '8: press flat wth spatula',
      '9: grill each side for 2 minutes'
    ];

    const newRecipeName = 'TESTgrilled cheeseTEST' + (new Date()).getTime();
    let recipeId = 0;
    let didCreateSteps = false;
    let lastStep = null;

    const check = (done) => {
      return didCreateSteps ? done() : setTimeout(() => {
        check(done);
      }, 100);
    };    

    describe('Step#add()', () => {
      it('should add steps without error', async () => {
        const newRecipe = await Recipe.add(newRecipeName, 100);
        recipeId = newRecipe.id;
        Promise.all(steps.map(async (step, i) => {
          const newStep = await Step.add(step, i+1, recipeId);
          expect(newStep).to.be.an.instanceOf(Step);
          return newStep;
        })).then(allSteps => {
          didCreateSteps = true;
          lastStep = allSteps[allSteps.length - 1];
        });
      });      
    });
    
    describe('Step#forRecipe', () => {
      before((done) => {
        check(done);
      });    
      
      it('should return all the steps for a recipe', async () => {
        const dbSteps = await Step.forRecipe(recipeId);
        expect(dbSteps.length).to.equal(steps.length);
      });
      it('should retain the order by step number', (done) => {
        Step.forRecipe(recipeId)
          .then(allSteps => {        
            // console.log(`there should be ${allSteps.length} steps tested.`);
            for (let i = 0; i<allSteps.length; i++) {
              let step = allSteps[i];
              // console.log(`db: ${step.description}`);
              // console.log(`__: ${steps[i]}`);
              expect(step.description).to.equal(steps[i]);
              if (i === allSteps.length - 1) {
                done();
              }
            }

          });
      });      
    });

    describe('.steps', () => {
      before((done) => {
        check(done);
      });
      
      it('should return all the steps for a recipe', async () => {
        const recipe = await Recipe.get(recipeId);
        const dbSteps = await recipe.steps;
        expect(dbSteps.length).to.equal(steps.length);
        expect(dbSteps.map(s => s.description).join('')).to.equal(steps.join(''));
      });
    });

    describe('Step#save()', () => {
      before((done) => {
        check(done);
      });    
      it('should update the version number if the description has changed', async () => {
        lastStep.description += (new Date()).getTime();
        await lastStep.save();

        const dbLastStep = await Step.get(lastStep.id);
        expect(dbLastStep.version_number - 1).to.equal(lastStep.version_number);
      });
    });

    
    // it('should delete steps when you delete a recipe', async () => {
      
    // });
  });
});
