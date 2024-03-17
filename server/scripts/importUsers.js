/*
 * Create a sample user in the database. The sample user will get fetched by
 * the front end Profile.tsx
 */

const db = require("../models/index");
const User = db.User;

async function createUser() {
  try {
    const newUser = {
        username: 'Apostolu',
        passwordHash: 'sampleHash',
        preferredName: 'Alex',
        email: 'apostolu240@gmail.com',
        score: 100
    };

    const existingUser = await User.findOne({ where: { email: newUser.email } });

    if (existingUser) {
      // If a user with the same email exists, update their information
      const updatedUser = await existingUser.update(newUser);
      console.log("User updated:", updatedUser);
    } else {
      // If no user with the same email exists, create a new user
      const createdUser = await User.create(newUser);
      console.log("New user created:", createdUser);
    }
  } catch (error) {
    console.error("Error creating new user:", error);
  }
}

createUser();
