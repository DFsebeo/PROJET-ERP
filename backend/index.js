const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRoutes = require('./routes/employes'); // Import des routes des employés

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/employes', employeesRoutes); // Utilisation des routes pour les employés

// Route par défaut pour gérer les 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
