drop table if exists task;
drop table if exists account;

create table account (
    id serial primary key,
    email varchar(50) not null,
    password varchar(255) not null
);

create table task (
    id serial primary key,
    title varchar(255) not null,
);

insert into task (description) values ('My test task');
insert into task (description) values ('My other test task');