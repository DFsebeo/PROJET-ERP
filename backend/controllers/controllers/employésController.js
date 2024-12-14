// backend/controllers/employésController.js

const { Client } = require('pg');

// Connexion à PostgreSQL
const client = new Client({
  user: 'serveurlogistrans',
  host: 'serveurlogistrans.postgres.database.azure.com',
  database: 'postgres',
  password: 'Emilie1969',
  port: 5432,
});

client.connect();

// Fonction pour récupérer tous les employés
const getAllEmployes = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM employes');
    res.json(result.rows); // Retourne la liste des employés récupérés depuis la DB
  } catch (err) {
    console.error('Erreur lors de la récupération des employés', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
  }
};

// Fonction pour récupérer un employé par ID
const getEmployeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await client.query('SELECT * FROM employes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.json(result.rows[0]); // Retourne l'employé trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'employé', err);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
  }
};

module.exports = {
  getAllEmployes,
  getEmployeById,
};
