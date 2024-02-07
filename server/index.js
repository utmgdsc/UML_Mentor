const express = require('express');
const app = express();
const db = require('./models');

app.use(express.json());

const PORT = process.env.PORT || 3000;


// Sync Sequelize models and create a test user
db.sequelize.sync({ force: true }).then(async () => { // Use { force: true } cautiously as it will drop existing tables
    console.log('Database synced');

    // Create a test user
    try {
        const testUser = await db.User.create({
            username: 'testuser',
            passwordHash: 'testpassword',
            email: 'test@example.com',
            preferredName: 'Test',
            score: 1
        });
        console.log('Test user created:', testUser.toJSON());
    } catch (err) {
        console.error('Failed to create test user:', err);
    }

    // Start listening for requests after the database is ready
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the server!' });
});
