const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace the string with a proper route handler
app.get('/', (req, res) => {
  res.json({ 
    user: {
      name: "John",
      email: "test@example.com",
  } });
});

// Replace the string with a proper route handler
app.get('/water', (req, res) => {
  res.json({ 
    user: {
      water: 1.5 ,
    } 
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
