use neatstack;

set @user_id = 'fred';

insert into user(user_id, email, password) values
	(@user_id, 'fred@gmail.com', sha1('fredfred'));

set @board_id = 'abcd1234';

insert into kboard(board_id, user_id, title, comments, created_on) values
	(@board_id, @user_id, 'My First Board', '', current_timestamp());

insert into kcard(board_id, description, priority) values
	(@board_id, 'Todo #1', 0),
	(@board_id, 'Todo #2', 1),
	(@board_id, 'Todo #3', 1);

set @board_id = 'abcd5678';

insert into kboard(board_id, user_id, title, comments, created_on) values
	(@board_id, @user_id, 'My Second Board', '', current_timestamp());

insert into kcard(board_id, description, priority) values
	(@board_id, 'Todo #1', 0),
	(@board_id, 'Todo #2', 1);

set @board_id = 'wxyz1234';

insert into kboard(board_id, user_id, title, comments, created_on) values
	(@board_id, @user_id, 'My Third Board', '', current_timestamp());
