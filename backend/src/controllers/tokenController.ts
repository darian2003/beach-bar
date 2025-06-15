import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface TokenMapping {
  token_to_umbrella: {
    [key: string]: string;
  };
}

export const validateToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Read the token mapping file
    const mappingPath = path.join(__dirname, '../../umbrella_token_mapping.json');
    const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf-8')) as TokenMapping;


    // Check if token exists in mapping
    const umbrellaId = mappingData.token_to_umbrella[token];

    if (umbrellaId) {
      res.json({
        valid: true,
        umbrellaId
      });
    } else {
      res.json({
        valid: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      valid: false,
      message: 'Internal server error'
    });
  }
}; 