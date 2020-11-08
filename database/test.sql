set @rec = '{
	"boardId": "5e9770d6",
	"title": "My New Board",
	"createdBy": "fred",
	"comments": "This board is added by fred",
	"createdOn": 1604714366814,
	"cards": [
		{ "description": "Item #0", "priority": 0 },
		{ "description": "Item #1", "priority": 1 },
		{ "description": "Item #3 NEW", "priority": 1 },
		{ "description": "Item #4 NEW", "priority": 1 }
	]
}';

drop procedure if exists update_kboard;

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

set @ok = false;

call update_kboard(@rec, @ok);

select @ok;

