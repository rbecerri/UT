USE sakila;

#1a. Display the first and last names of all actors from the table actor.
Select first_name, last_name from actor;
#1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
Select upper(concat(first_name, " ", last_name)) as 'Actor Name' from actor;
#2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
Select actor_id, first_name, last_name from actor where first_name = 'Joe';
#2b. Find all actors whose last name contain the letters GEN:
Select * from actor where last_name like '%GEN%';
#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
Select * from actor where last_name like '%LI%' order by last_name, first_name;
#2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
Select country_id, country from country where country in ('Afghanistan', 'Bangladesh', 'China');
#3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
alter table actor add column description blob;
#3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
alter table actor drop column description;
#4a. List the last names of actors, as well as how many actors have that last name.
Select last_name, count(*) from actor group by last_name;
#4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
Select last_name, count(*) from actor group by last_name having count(*) >= 2; 
#4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
select * from actor where first_name = 'GROUCHO' and last_name = 'WILLIAMS';
Update actor set first_name = 'HARPO' where first_name = 'GROUCHO' and last_name = 'WILLIAMS';
select * from actor where first_name = 'HARPO' and last_name = 'WILLIAMS';
#4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
Update actor set first_name = 'GROUCHO' where (first_name = 'HARPO' or first_name = 'GROUCHO') and last_name = 'WILLIAMS';
Select * from actor where (first_name = 'HARPO' or first_name = 'GROUCHO') and last_name = 'WILLIAMS';
#5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
#Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html
SHOW CREATE TABLE address;
#6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
Select s.first_name, s.last_name, a.* 
	from staff s 
		inner join address a on s.address_id = a.address_id;
#6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
Select s.first_name, s.last_name, sum(p.amount) as Amount
	from staff s 
		inner join payment p on s.staff_id = p.staff_id 
		where month(p.payment_date) = 8 and year(p.payment_date) = 2005
	group by s.first_name, s.last_name;
#6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
Select f.title, count(*) 'Number of Actors'
	from film f
		inner join film_actor fa on f.film_id = fa.film_id
	group by f.title;
Select 
	f.title, (select count(*) from film_actor fa where f.film_id = fa.film_id) 'Number of Actors' 
    from  film f;
#6d. How many copies of the film Hunchback Impossible exist in the inventory system?
Select count(*) Copies 
	from film f
		inner join inventory i on f.film_id = i.film_id
	where f.title = 'Hunchback Impossible';
#6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
#	![Total amount paid](Images/total_payment.png)
Select c.first_name, c.last_name, sum(p.amount) as 'Total amount paid'
	from customer c
		inner join payment p on c.customer_id = p.customer_id
	group by c.first_name, c.last_name
    order by c.last_name;
#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
Select title from film 
	where language_id in (Select language_id from language where name = 'English')
		and (
			film_id in (Select film_id from film where title like 'K%')
            or
            film_id in (Select film_id from film where title like 'Q%')
		);
#7b. Use subqueries to display all actors who appear in the film Alone Trip.
select * from actor 
	where actor_id in (
		select fa.actor_id 
			from film_actor fa 
				inner join film f on fa.film_id = f.film_id 
			where f.title = 'Alone Trip'
        );
#7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
Select c.first_name, c.last_name, c.email 
	from customer c
		inner join address a on c.address_id = a.address_id
        inner join city ci on a.city_id = ci.city_id
        inner join country co on ci.country_id = co.country_id
        where co.country = 'Canada';
#7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
Select f.title
	from film f
		inner join film_category fc on fc.film_id = f.film_id
		inner join category c on c.category_id = fc.category_id
        where c.name = 'Family';
#7e. Display the most frequently rented movies in descending order.
select f.title, count(*) rental
	from film f
		inner join inventory i on i.film_id = f.film_id
		inner join rental r on r.inventory_id = i.inventory_id
	group by f.title
    order by rental desc;
#7f. Write a query to display how much business, in dollars, each store brought in.
select s.store_id, sum(p.amount) rental
	from store s
		inner join inventory i on s.store_id = i.store_id
		inner join rental r on r.inventory_id = i.inventory_id
        inner join payment p on p.customer_id = r.customer_id
	group by s.store_id
    order by s.store_id desc;
#7g. Write a query to display for each store its store ID, city, and country.
select s.store_id, c.city, co.country
	from store s
		inner join address a on s.address_id = a.address_id
		inner join city c on c.city_id = a.city_id
        inner join country co on co.country_id = c.country_id
    order by s.store_id desc;
#7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select c.name, sum(p.amount) rental
	from category c
		inner join film_category fc on fc.category_id = c.category_id
		inner join inventory i on i.film_id = fc.film_id
		inner join rental r on r.inventory_id = i.inventory_id
        inner join payment p on p.customer_id = r.customer_id
	group by c.name
    order by sum(p.amount) desc Limit 5;
#8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
Create View topfivegeneres
	as select c.name, sum(p.amount) rental
	from category c
		inner join film_category fc on fc.category_id = c.category_id
		inner join inventory i on i.film_id = fc.film_id
		inner join rental r on r.inventory_id = i.inventory_id
        inner join payment p on p.customer_id = r.customer_id
	group by c.name
    order by sum(p.amount) desc Limit 5;
select * from topfivegeneres;
#8b. How would you display the view that you created in 8a?
SHOW CREATE VIEW topfivegeneres;
#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW topfivegeneres;
