drop view if exists kboard_summary;

create view kboard_summary as
	select u.user_id, u.email, b.board_id, b.title, count(c.card_id) as card_count
		from user u
		join kboard b
		on u.user_id = b.user_id
		left join kcard c
		on b.board_id = c.board_id
		group by b.board_id;

