const express = require('express');
const router = express.Router();
const { Client } = require('pg');

// Configuration de la connexion à la base de données PostgreSQL
const client = new Client({
  user: 'postgresadmin',
  host: 'serveurlogistrans.postgres.database.azure.com',
  database: 'postgres',
  password: 'Emilie1969',
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Connexion à la base de données
client.connect()
  .then(() => console.log('Connecté à la base de données PostgreSQL'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

// Route POST pour enregistrer un employé
router.post('/', async (req, res) => {
    console.log('Route POST /api/employes appelée');
    console.log('Données reçues pour l\'insertion:', req.body);

    const { prenom, nom, societe, fonction, salaire, statut, permis, experience, specialite, cni, prime, enfants, remarques } = req.body;

    // Vérification des champs obligatoires
    if (!prenom || !nom || !fonction || !salaire || !statut) {
        console.error('Erreur: Tous les champs requis doivent être remplis.');
        return res.status(400).json({ error: "Tous les champs requis doivent être remplis." });
    }

    try {
        console.log(`Insertion dans la base de données avec les valeurs : ${prenom}, ${nom}, ${societe}, ${fonction}, ${salaire}, ${statut}`);
        
        // Journaux avant l'insertion
        console.log('Début de la requête d\'insertion');
        
        // Insérer dans la base de données
        const result = await client.query(
            'INSERT INTO employes (prenom, nom, societe, fonction, salaire, statut, permis, experience, specialite, cni, prime, enfants, remarques) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
            [prenom, nom, societe, fonction, salaire, statut, permis, experience, specialite, cni, prime, enfants, remarques]
        );

        // Journaux après l'insertion
        console.log('Fin de la requête d\'insertion');
        console.log('Employé ajouté:', result.rows[0]);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        // Journaux détaillés pour capturer les erreurs spécifiques
        console.error('Erreur lors de l\'ajout de l\'employé:', error);
        console.error('Détails de l\'erreur:', error.message);

        // Vérification des détails d'erreur
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'employé', details: error.message });
    }
});

module.exports = router;
