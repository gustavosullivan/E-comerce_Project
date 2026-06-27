create table tb_product (
                            id serial not null,
                            description varchar(100) not null,
                            brand varchar(255) not null,
                            model varchar(255) not null,
                            currency varchar(3) not null,
                            price float(53) not null,
                            stock integer not null,
                            primary key (id)
);