const db = require('../models'); 

async function authMiddleware(req, res, next) {
    try {
        const utorid = req.headers.utorid;
        const http_mail = req.headers.http_mail;

        let user = await db.User.findOne({ where: { username: utorid } });

        if (!user) {
            user = await db.User.create({
                username: utorid,
                email: http_mail, 
                role: 'user',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports = authMiddleware;
