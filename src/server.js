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
    }
  });
});

// Replace the string with a proper route handler
app.get('/water', (req, res) => {
  res.json({
    user: {
      water: 1.5,
    }
  });
});

app.get('/get-workouts', (req, res) => {
  res.json({
    workouts: 15,
  });
});

app.get('/get-calories', (req, res) => {
  res.json({
    calories: 3520,
  });
});

app.get('/get-days-active', (req, res) => {
  res.json({
    daysActive: 7,
  });
});

app.get('/get-graph', (req, res) => {
  res.json({
    calories: 800,
    day: "Wed"
  });
});

app.get('/get-following', (req, res) => {
  res.json({
    following: 0,
  });
});

app.get('/get-followers', (req, res) => {
  res.json({
    followers: 0,
  });
});

app.get('/follower-history', (req, res) => {
  res.json({
    user: {
      date: 1762377618,
      name: "username"
    }
  });
});

app.get('/get-latest-activity', (req, res) => {
  res.json({
    activity: "desk workout",
    date: 1762377618,
  });
});

app.get('/get-friends-activity', (req, res) => {
  res.json({
    user: {
      name: "username",
      date: 1762377618,
      activity: "stretch"
    }
  });
});

app.get('/get-friends-suggestions', (req, res) => {
  res.json({
    user: {
      name: "username",
      email: "test@test.com",
    }
  });
});





const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
