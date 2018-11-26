insert into tags
  (name)
values
  ('snacks'),
  ('dinner'),
  ('brunch'),
  ('lunch'),
  ('party'),
  ('vegetarian');
  
insert into recipes
  (name, number_of_servings)
values
  ('meatloaf', 4),
  ('steak tartare', 6),
  ('potato au gratin', 4),
  ('nicoise salad', 2),
  ('burgers', 4),
  ('fries', 4),
  ('brisket', 10);

insert into recipes_tags
  (recipe_id, tag_id)
values
  (1, 2),
  (2, 2),
  (2, 3),
  (3, 2),
  (3, 4),
  (4, 4),
  (4, 3),
  (4, 5),
  (5, 2),
  (5, 4),
  (6, 2),
  (6, 4),
  (7, 2),
  (7, 5);

insert into ingredients
  (name)
values
  ('ground beef'),
  ('potatoes'),
  ('onions'),
  ('greens'),
  ('tomatoes'),
  ('anchovies'),
  ('buns'),
  ('brisket');

insert into amounts
  (recipe_id, ingredient_id, quantity, measurement)
values
  (1, 1, 2.0, 'pounds'),
  (2, 1, 1.25, 'pounds'),
  (3, 2, 1, 'pounds'),
  (3, 3, 1, 'medium'),
  (4, 4, 0.5, 'pounds'),
  (4, 5, 0.5, 'small'),
  (4, 6, 1, 'tin'),
  (5, 1, 1.25, 'pounds'),
  (5, 7, 1, 'pack of buns'),
  (6, 2, 1, 'pounds'),
  (7, 8, 1, 'whole brisket');


insert into meals
  (made_on)
values
  ('2018-11-10'),
  ('2018-11-11'),
  ('2018-11-12');

insert into recipes_meals
  (meal_id, recipe_id, notes)
values
  (1, 1, 'needs more ketchup'),
  (1, 3, 'yum!'),
  (2, 5, 'super juicy'),
  (2, 6, 'great cajun seasoning'),
  (3, 7, 'so smoky');

insert into steps
  (recipe_id, step_number, description, version_number)
values
  (2, 1, 'cut up the meat', 1),
  (2, 2, 'season the meat', 1),
  (2, 3, 'garnish', 1),
  (2, 3, 'garnish with love', 2);









