const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Autorise les requêtes provenant d'autres origines

// Configuration de la connexion PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DFSLOGISTIC',
    password: '1987',
    port: 5432,
});

// Vérification de la connexion à PostgreSQL
pool.connect(err => {
    if (err) {
        console.error('Erreur de connexion à PostgreSQL :', err.message);
    } else {
        console.log('Connexion réussie à PostgreSQL');
    }
});

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur votre serveur Node.js !');
});

// Route pour récupérer les employés
app.get('/employes', async (req, res) => {
    try {
        console.log('Requête GET /employes reçue');
        const result = await pool.query('SELECT * FROM employes');
        console.log('Employés récupérés :', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des employés :', err.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des employés' });
    }
});

// Route pour insérer un employé avec validation
app.post('/employes', async (req, res) => {
    const {
        prenom, nom, societe, fonction, permis, experience,
        specialite, cni, statut, salaire, prime, enfants, remarques
    } = req.body;

    console.log('Données reçues pour POST /employes :', req.body);

    // Validation des champs obligatoires
    if (!prenom || !nom || !fonction || !statut || !salaire) {
        return res.status(400).json({
            error: 'Les champs "prenom", "nom", "fonction", "statut" et "salaire" sont obligatoires.',
        });
    }

    try {
        // Requête d'insertion SQL
        const query = `
            INSERT INTO employes 
            (prenom, nom, societe, fonction, permis, experience, specialite, cni, statut, salaire, prime, enfants, remarques) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
        `;
        const values = [prenom, nom, societe, fonction, permis, experience, specialite, cni, statut, salaire, prime, enfants, remarques];

        console.log('Requête SQL :', query);
        console.log('Valeurs :', values);

        // Exécution de la requête
        const result = await pool.query(query, values);

        console.log('Employé enregistré :', result.rows[0]);
        res.status(201).json({
            message: 'Employé enregistré avec succès',
            employe: result.rows[0],
        });
    } catch (err) {
        console.error('Erreur lors de l’enregistrement :', err.message);

        // Envoi d'un message d'erreur plus descriptif au frontend
        res.status(500).json({
            error: 'Erreur lors de l’enregistrement de l’employé',
            details: err.message,
        });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
