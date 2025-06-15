-- Create menu items
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categorie VARCHAR(50),
    nume VARCHAR(100),
    cantitate_ml INT,
    pret_lei INT,
    descriere TEXT
);

-- Create orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  umbrella_id INTEGER NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed')) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create order items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL
);
