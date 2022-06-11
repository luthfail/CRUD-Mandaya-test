const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

const generateToken = (user) => {
    return jwt.sign(user, key)
}

const verifyToken = (token) => {
    return jwt.verify(token, key)
}

const hashPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
}

const comparePassword = (password, hashPassword) => {
    const isValid = bcrypt.compareSync(password, hashPassword);
    return isValid;
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword
}