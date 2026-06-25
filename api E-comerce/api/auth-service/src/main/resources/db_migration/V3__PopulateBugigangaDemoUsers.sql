INSERT INTO tb_user (name, email, password, type)
SELECT 'Comprador Bugiganga',
       'comprador@bugigangas.com',
       '$2a$10$XTaeziacPzpn9YIMBFRPBe9fwL7mIrxQFyqVv7GOb4brwLkJmMZcC',
       1
WHERE NOT EXISTS (
    SELECT 1 FROM tb_user WHERE email = 'comprador@bugigangas.com'
);

INSERT INTO tb_user (name, email, password, type)
SELECT 'Vendedor Bugiganga',
       'vendedor@bugigangas.com',
       '$2a$10$6bYchk4FNnp5uinZYRqtMul//EP0D8O0Dw/QAvwC7oFLafh4dR3hu',
       0
WHERE NOT EXISTS (
    SELECT 1 FROM tb_user WHERE email = 'vendedor@bugigangas.com'
);
