const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Connexion à PostgreSQL
const pool = new Pool({
  user: 'postgres', // Ton utilisateur PostgreSQL
  host: 'localhost',
  database: 'DFSLOGISTIC', // Nom de ta base de données
  password: '1987', // Ton mot de passe
  port: 5432,
});

// Middleware pour journaliser les requêtes entrantes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Corps de la requête (req.body) :', req.body);
  next();
});

// Route pour créer une nouvelle demande d'achat
router.post('/create', async (req, res) => {
  const {
    designation,
    immatriculation,
    date,
    demandeur,
    quantite,
    prix_unitaire,
    type,
    statut,
    fournisseur,
    date_livraison,
    parc,
  } = req.body;

  // Validation des champs obligatoires
  if (!designation || !date || !demandeur || !quantite || !prix_unitaire || !type || !statut) {
    console.error('Erreur : des champs obligatoires sont manquants.');
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO demandes_achats (
        designation, immatriculation, date, demandeur, quantite, prix_unitaire, 
        type, statut, fournisseur, date_livraison, parc, date_creation
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
      ) RETURNING *`,
      [
        designation,
        immatriculation,
        date,
        demandeur,
        quantite,
        prix_unitaire,
        type,
        statut,
        fournisseur,
        date_livraison,
        parc,
      ]
    );

    console.log('Insertion réussie :', result.rows[0]);
    res.status(201).json({ message: 'Demande d\'achat créée avec succès', data: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de l\'insertion :', error.message);
    res.status(500).json({ error: 'Erreur lors de la création de la demande d\'achat', details: error.message });
  }
});

// Route pour récupérer toutes les demandes d'achat
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM demandes_achats ORDER BY date_creation DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes d\'achats', details: error.message });
  }
});

module.exports = router;
