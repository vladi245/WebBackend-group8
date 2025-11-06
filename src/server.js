const express = require('express');
const cors = require('cors');
const usersRouter = require('../routes/users');
const exampleUser = require('../models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes under /api
app.use('/api', usersRouter);

// Return model data at root route
app.get('/', (req, res) => {
  res.json(exampleUser);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
