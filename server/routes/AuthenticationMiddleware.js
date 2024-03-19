module.exports = (User) => async (req, res, next) => {
    try {
        const utorid = req.headers.utorid;

        let user = await User.findByPk(utorid);

        if (!user) {
            // can be adjusted to make test admin users
            user = await User.create({
                username: utorid,
                email: req.headers.http_mail, // can we get the email frrom shibboleth?
                role: 'user',
            });
        }
        req.headers.user_role = user.role;

        next();
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
