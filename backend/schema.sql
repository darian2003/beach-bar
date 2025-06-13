-- Create menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(6, 2) NOT NULL
);

-- Create orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  umbrella_id INTEGER NOT NULL,
  status TEXT CHECK (status IN ('new', 'preparing', 'delivered')) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create order items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_id TEXT REFERENCES menu_items(id),
  quantity INTEGER NOT NULL
);
