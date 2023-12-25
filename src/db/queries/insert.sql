INSERT INTO users (id, name, email, password)
VALUES
    ('3f56a4c8-768a-4ad5-91de-75c57f4408ae', 'Wayne', 'wayne@email.com', '12345678'),
    ('f3e89a8d-8f57-4522-9c67-7db2bc682db6', 'Alex', 'alex@email.com', '12345678');

INSERT INTO products (id, title, description, price)
VALUES
    ('7e2e7992-9e69-4a93-8be8-cf1fdb8b511a', 'iPhone 1', 'iPhone 1', 10),
    ('a485b7df-ba02-4564-96d1-50c5794d296d', 'iPhone 10', 'iPhone 10', 100),
    ('a91758e1-550a-4266-a4d9-25504a4d85e7', 'iPhone 100', 'iPhone 100', 1000);

INSERT INTO stock (product_id, count)
VALUES
    ('7e2e7992-9e69-4a93-8be8-cf1fdb8b511a',  10),
    ('a485b7df-ba02-4564-96d1-50c5794d296d', 100),
    ('a91758e1-550a-4266-a4d9-25504a4d85e7', 1000);

INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('1a62e5e4-0e10-4a84-81e4-816784d84055', '3f56a4c8-768a-4ad5-91de-75c57f4408ae', '2023-07-10', '2023-07-10', 'OPEN'),
    ('8791735b-2e79-48ef-9a1d-d827a4a4ef37', 'f3e89a8d-8f57-4522-9c67-7db2bc682db6', '2023-07-11', '2023-07-12', 'ORDERED');


INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('1a62e5e4-0e10-4a84-81e4-816784d84055', '7e2e7992-9e69-4a93-8be8-cf1fdb8b511a', 2),
    ('1a62e5e4-0e10-4a84-81e4-816784d84055', 'a485b7df-ba02-4564-96d1-50c5794d296d', 1),
    ('8791735b-2e79-48ef-9a1d-d827a4a4ef37', 'a91758e1-550a-4266-a4d9-25504a4d85e7', 3);
