const { User } = require('../models');
const { comparePassword, generateToken } = require('../helpers');

class UserController {
    static async register(req, res, next) {
        try {
            const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
            let { phoneNumber, password, dateOfBirth, KTP, gender, role } = req.body;
            if(phoneNumber[0] != 6 && phoneNumber[1] != 2 ) {
                throw ({name: 'INVALID', message: 'invalid phone number'})
            }
            if(!regex.test(password)) {
                throw ({name: 'INVALID', message: 'minimum password length is 6 character and should contain atleast one Uppercase, one number and one special character'});
            }
            let newKTP
            if(gender == 'female') {
                const rearrange = Number(KTP.slice(6,7)) + 4
                newKTP = [...KTP]
                newKTP[6] = String(rearrange)
                newKTP = newKTP.join('')
            } else if(gender == 'male') {
                newKTP = [...KTP]
                newKTP = newKTP.join('')
            }
            const newUser = await User.create({
                phoneNumber,
                password,
                gender,
                role,
                KTP : newKTP,
                dateOfBirth
            });
            res.status(201).json({
                message: 'User created successfully',
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                KTP: newUser.KTP,
            });
        } catch (err) {
            console.log(err)
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { phoneNumber, password } = req.body;
            const user = await User.findOne({
                where: {
                    phoneNumber
                }
            });
            if(!user) {
                throw ({name: 'NOT_FOUND', message: 'Invalid phone number or password'});
            }
            const isValid = comparePassword(password, user.password);
            if(!isValid) {
                throw ({name: 'INVALID', message: 'Invalid phone number or password'});
            }
            const payload = {
                id: user.id,
                role: user.role,
                user: user.phoneNumber
            }
            const token = generateToken(payload);
            res.status(200).json({
                message: 'Login success',
                token
            });
        } catch (err) {
            console.log(err)
            next(err);
        }
    }

    static async topUp(req, res, next) {
        try {
            const { id } = req.user;
            const { balance } = req.body;
            const findUser = await User.findByPk(+id);
            if(!findUser) {
                throw ({name: 'NOT_FOUND', message: 'User not found'});
            }
            if(balance < 0) {
                throw ({name: 'INVALID', message: 'Balance cannot be negative'});
            }
            const newBalance = +findUser.balance + +balance;
            console.log(newBalance)
            await User.update({
                balance: newBalance
            }, {
                where: {
                    id
                }
            });
            res.status(200).json({
                message: 'Top up success'
            });
        } catch (err) {
            console.log(err)
            next(err);
        }
    }
}

module.exports = UserController;