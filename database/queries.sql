DROP TABLE IF EXISTS books,notes;

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	book_cover TEXT,
	title TEXT NOT NULL,
	isbn VARCHAR(25) NOT NULL,
	date_read DATE NOT NULL DEFAULT CURRENT_DATE,
	rating INTEGER NOT NULL,
	book_link VARCHAR(255),
	summary TEXT NOT NULL
);

CREATE TABLE notes (
	id SERIAL PRIMARY KEY,
	note TEXT NOT NULL,
	book_id INTEGER REFERENCES books(id)
);

INSERT INTO books (book_cover, title, isbn, date_read, rating , book_link, summary)
VALUES 
('https://covers.openlibrary.org/b/ISBN/9780306846335-M.jpg', 'Embrace the Suck', '9780306846335', '2020-04-15', 5,
'https://openlibrary.org/works/OL22166372W/Embrace_the_Suck?edition=key%3A/books/OL30203799M', 'An important and fascinating book. The author shares the hardships of his Navy Seal training and experience as a guide to empower and equip us for the challenges and decisions we face in our own lives. He does a wonderful job getting the reader to shift their perspective and take effective action. There is also a nice addition of humor. In summary if you have aspirations to do challenging yet rewarding work, this is a serious read.'),
('', 'Mini Habits', '9781494882273', '2020-04-15', 5,
'https://openlibrary.org/books/OL26396947M/Mini_Habits', 'This book is all about starting small to reach big goals. Since reading this book, I’ve adapted several mini habits like: 1. Coding for 30 minutes everyday (since practice 30 minutes always seemed like a mountain of a task) 2. Write 1 journal page a day (since 200 and even 2000 seemed overwhelming) 3. Read two pages a day (since read for one hour before bed feels daunting at the end of the day) and 4. Exercise or do 20 minutes of yoga everyday');

INSERT INTO notes ( note, book_id) 
VALUES 	
('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1),
('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 2);