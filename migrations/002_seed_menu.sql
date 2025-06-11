-- Insert default menu items
INSERT INTO menu_items (id, name, price) VALUES 
  ('coke', 'Coca-Cola', 3.00),
  ('beer', 'Heineken', 5.00),
  ('water', 'Still Water', 2.00),
  ('chips', 'Chips', 4.00)
ON CONFLICT (id) DO NOTHING;
