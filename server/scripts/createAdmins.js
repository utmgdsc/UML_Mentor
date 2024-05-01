const db = require("../models/index");
const User = db.User;

const admins = [{"username": "yaremchu", "email": "vlad.yaremchuk@mail.utoronto.ca"}, {"username": "engine14", "email": "rutwa.engineer@utoronto.ca"}];

module.exports = async function createAdmins(role = "admin"){
    for (const admin of admins) {
        const user = await User.findByPk(admin.username);
        if (user) {
            continue;
        }
        const newUser = await User.create({
            username: admin.username,
            email: admin.email,
            role: role,
        });
    }
}