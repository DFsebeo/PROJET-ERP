const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRoutes = require('./routes/employees'); // Import des routes des employés

const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // Permet les requêtes Cross-Origin (entre frontend et backend)
app.use(bodyParser.json()); // Parse les données JSON envoyées par le frontend

// Routes
app.use('/employes', employeesRoutes); // Utilisation des routes pour les employés

// Route par défaut pour gérer les 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
