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
