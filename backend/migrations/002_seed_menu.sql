-- Insert default menu items
INSERT INTO menu_items (name, price) VALUES 
  ('Coca-Cola', 3.00),
  ('Heineken', 5.00),
  ('Still Water', 2.00),
  ('Chips', 4.00)
ON CONFLICT (name) DO NOTHING;
