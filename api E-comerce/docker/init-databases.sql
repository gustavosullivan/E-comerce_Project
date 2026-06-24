-- Cria os 3 bancos usados pelos microserviços.
-- Rodado automaticamente na primeira subida do container PostgreSQL.

CREATE DATABASE db_user;
CREATE DATABASE db_product;
CREATE DATABASE db_currency;
CREATE DATABASE db_order;