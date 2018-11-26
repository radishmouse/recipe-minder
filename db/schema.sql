

create table tags (
  id serial primary key,
  name varchar(75) unique not null
);

create table recipes (
  id serial primary key,
  name varchar(300) unique not null,
  number_of_servings integer,
);

create table recipes_tags (
  recipe_id integer references recipes (id),
  tag_id integer references tags (id)
);

create table ingredients (
  id serial primary key,
  name varchar(300) not null
);

create table amounts (
  recipe_id integer references recipes (id),
  ingredient_id integer references ingredients (id),
  amount_per_serving numeric not null
);

create table meals (
  made_on timestamp not null,
  notes text
);

create table recipes_meals (
  recipe_id integer references recipes (id),
  meal_id integer references meals (id)
);

create table steps (
  id serial primary key,
  step_number integer not null,
  description text not null
  version_number integer,
  recipe_id integer references recipes (id)
);
