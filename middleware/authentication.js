const { User } = require('../models');
const { verifyToken } = require('../helpers');

const auth = async (req, res, next) => {
    try {
        const { access_token } = req.headers;
        const ticket = verifyToken(access_token);
        const response = await User.findByPk(ticket.id);
        if(!response || !access_token) {
            throw ({name: 'Invalid token'});
        } else {
            req.user = {
                id: response.id,
                role: response.role,
                user: response.phoneNumber
            }
            next();
        }
    } catch (err) {
        next(err)
    }
}

module.exports = auth;