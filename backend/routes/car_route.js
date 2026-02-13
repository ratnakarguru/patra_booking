import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/taxis
router.get('/', async (req, res) => {
    try {
        // Note: Make sure 'carmodel' matches your exact table name in phpMyAdmin!
        const query = `
      SELECT 
        carmodel_id AS id,
        carmodel_name AS name,
        CONCAT(carmodel_passgrno, ' Seats | ', carmodel_airconditionr) AS \`desc\`,
        carmodel_image AS image
      FROM tbl_carmodels 
      WHERE show_home = 1
    `;

        const [taxis] = await db.query(query);
        res.status(200).json(taxis);

    } catch (error) {
        console.error('Error fetching car models:', error);
        res.status(500).json({ message: 'Failed to fetch taxis' });
    }
});

export default router;