drop database if exists neatstack;

create database neatstack;

use neatstack;

create table user (
	user_id varchar(16) not null,
	email varchar(64) not null,
	password varchar(128) not null,

	primary key(user_id),
	key(email)
);

create table kboard (
	board_id char(8) not null,
	user_id varchar(16) not null,
	title varchar(64) not null,
	comments tinytext,
	created_on timestamp not null,
	updated_on timestamp on update current_timestamp,

	primary key(board_id),

	constraint fk_user_id foreign key(user_id)
		references user(user_id)
		on delete cascade
);

create table kcard (
	card_id int not null auto_increment,
	board_id char(8) not null,
	description varchar(64) not null,
	priority tinyint default 0,

	primary key(card_id),

	constraint fk_board_id foreign key(board_id)
		references kboard(board_id)
		on delete cascade
);

create view kboard_summary as
	select u.user_id, u.email, b.board_id, b.title, count(c.card_id) as card_count
		from user u
		join kboard b
		on u.user_id = b.user_id
		left join kcard c
		on b.board_id = c.board_id
		group by b.board_id;

delimiter //

create procedure update_kboard(in rec json, out ok boolean)
begin

	declare exit handler for sqlexception
	begin
		rollback;
		set ok = false;
		resignal;
	end;

	-- destructure rec
	set @board_id = json_value(rec, '$.boardId' returning char(8));
	set @title = json_value(rec, '$.title');
	set @user_id = json_value(rec, '$.createdBy');
	set @comments = json_value(rec, '$.comments');
	set @created_on = from_unixtime(json_value(rec, '$.createdOn' returning unsigned) / 1000);
	set @cards = json_value(rec, '$.cards' returning json);

	-- select @board_id, @created_on, @cards, @cards_len;

	-- check if kboard exists
	set @rec_count = 0;
	select count(*) into @rec_count from kboard
		where board_id = @board_id and user_id = @user_id;
	if @rec_count <= 0 then
		set @msg = concat('Board does not exists: board_id: ', @board_id, ', user_id: ', @user_id);
		signal sqlstate '44444'
			set message_text = @msg;
	end if;

	start transaction;
		-- update kboard
		update kboard set user_id = @user_id, title = @title, comments = @comments
			where board_id = @board_id and user_id = @user_id;

		-- delete kcard
		delete from kcard where board_id = @board_id;

		-- insert updated kcards
		set @i = 0;
		set @cards_len = json_length(@cards);

		-- create a prepare statement for insert
		prepare insert_kcard from 
			'insert into kcard(board_id, description, priority) values (?, ?, ?)';

		while @i < @cards_len do
			-- extract an element $[0]
			set @idx = concat('$[', @i, ']');
			set @card = json_extract(@cards, @idx);
			-- destructure
			set @description = json_value(@card, '$.description');
			set @priority = json_value(@card, '$.priority');

			execute insert_kcard using @board_id, @description, @priority;

			set @i := @i + 1;
		end while;

		deallocate prepare insert_kcard;

	commit;

	set ok = true;
end //

delimiter ;
