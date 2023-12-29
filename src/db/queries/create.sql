CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255)
);
CREATE TYPE CART_STATUS AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
	created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status CART_STATUS
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    cart_id UUID REFERENCES carts(id),
    payment JSON,
    delivery JSON,
    comments TEXT,
    status cart_status,
    total NUMERIC(10, 2)
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID REFERENCES carts(id),
    product_id UUID,
    count INTEGER
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    title varchar(255),
	description text,
    price NUMERIC(10, 2)
);

CREATE TABLE stock (
    product_id UUID REFERENCES products(id),
    count DECIMAL(10, 2)
);