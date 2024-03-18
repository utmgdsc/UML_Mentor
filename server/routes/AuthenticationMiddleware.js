module.exports = (User) => async (req, res, next) => {
    try {
        const utorid = req.headers.utorid;
        let user = await User.findOne({ where: { username: utorid } });

        if (!user) {
            // can be adjusted to make test admin users
            user = await User.create({
                username: utorid,
                passwordHash: 'defaultPasswordHash', // i am not sure if we need this for shibboleth
                email: req.headers.http_mail, // can we get the email frrom shibboleth?
                role: 'user',
            });
        }

        // Attach the user to the request object for use in subsequent middleware or handlers
        req.user = user;
        next();
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
