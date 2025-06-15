import { Request, Response } from "express";
import pool from "../config/database";

export const getMenu = async (req: Request, res: Response): Promise<void> => {
  console.log("Fetching menu...");
  try {
    const result = await pool.query(
      `SELECT id, nume, pret_lei, categorie, cantitate_ml, descriere FROM menu_items ORDER BY nume`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};