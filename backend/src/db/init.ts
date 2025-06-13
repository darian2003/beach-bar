import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'beach-bar-database',
});

async function initializeDatabase() {
  try {
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schemaSQL);
    console.log('Database schema initialized successfully');
    
    // Insert initial menu items
    const menuItems = [
      { id: '1', name: 'Cold Beer', price: 12.00 },
      { id: '2', name: 'Cola', price: 9.00 },
      { id: '3', name: 'Cocktail', price: 25.00 },
    ];

    for (const item of menuItems) {
      await pool.query(
        'INSERT INTO menu_items (id, name, price) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [item.id, item.name, item.price]
      );
    }
    
    console.log('Initial menu items inserted successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase();
