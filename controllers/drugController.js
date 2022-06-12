const { User, Drug, ShoppingCart, sequelize } = require('../models');

class DrugController {
    static async getAllDrugs(req, res, next) {
        try {
            const drugs = await Drug.findAll()
            res.status(200).json({
                drugs
            })
        } catch (err) {
            next(err)
        }
    }

    
    static async getDrug(req, res, next) {
        try {
            const { id } = req.params;
            const drug = await Drug.findByPk(id);
            if(!drug) {
                throw ({name: "INVALID", message: 'medicine not found'});
            }
            res.status(200).json({
                drug
            })
        } catch (err) {
            next(err)
        }
    }

    static async createDrug(req, res, next) {
        try {
            const { name, price, stock } = req.body;
            if(req.user.role !== 'admin') {
                throw ({name: 'FORBIDDEN', message: 'You are not authorized to create a drug'});
            } else {
                const drug = await Drug.create({
                    name,
                    price,
                    stock
                });
                res.status(201).json({
                    message: 'new medicine added',
                    drug
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async buyDrug(req, res, next) {
        try {
            const { id } = req.params;
            const drug = await Drug.findByPk(id);
            if(!drug) {
                throw ({name: "NOT_FOUND", message: 'medicine not found'});
            }
            const user = await User.findByPk(req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            await ShoppingCart.create({
                UserId: user.id,
                DrugId: drug.id,
            });
            res.status(201).json({
                message: 'medicine added to shopping cart, waiting to be paid'
            })
        } catch (err) {
            next(err)
        }
    }

    static async getShoppingCart(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            if(user.role === 'user') {
                const shoppingCart = await ShoppingCart.findAll({
                    include: [{
                        model: Drug,
                        attributes: ['name', 'price']
                    }],
                    where: {
                        UserId: user.id
                    }
                });
                if(shoppingCart.length === 0) {
                    throw ({name: "NOT_FOUND", message: 'Shopping cart not found'});
                }
                const totalPrice = shoppingCart.reduce((acc, curr) => acc + curr.Drug.price, 0);
                res.status(200).json({
                    shoppingCart,
                    totalPrice
                })
            } else if(user.role === 'admin') {
                const pendingPayment = await ShoppingCart.findAll({
                    include: [{
                        model: Drug,
                        attributes: ['name', 'price']
                    }],
                    where: {
                        isPaid: false
                    }
                });
                const pendingIncome = pendingPayment.reduce((acc, curr) => acc + curr.Drug.price, 0);
                const paid = await ShoppingCart.findAll({
                    include: [{
                        model: Drug,
                        attributes: ['name', 'price']
                    }],
                    where: {
                        isPaid: true
                    }
                });
                const successIncome = paid.reduce((acc, curr) => acc + curr.Drug.price, 0);
                res.status(200).json({
                    pendingPayment,
                    pendingIncome,
                    paid,
                    successIncome
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async payment(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const user = await User.findByPk(+req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            const shoppingCart = await ShoppingCart.findAll({
                include: [{
                    model: Drug,
                    attributes: ['id', 'name', 'price', 'stock']
                }],
                where: {
                    UserId: +user.id,
                    isPaid: false
                }
            }, { transaction: t });
            if(!shoppingCart) {
                throw ({name: "NOT_FOUND", message: 'Shopping cart not found'});
            }
            const totalPrice = shoppingCart.reduce((acc, curr) => acc + curr.Drug.price, 0);
            if(+user.balance < +totalPrice) {
                throw ({name: "FORBIDDEN", message: 'Balance not enough'});
            }
            await User.update({
                balance: +user.balance - +totalPrice
            }, {
                where: {
                    id: +user.id
                }
            }, { transaction: t });
            await shoppingCart.forEach(el => {
                Drug.update({
                    stock: +el.Drug.stock - 1
                }, {
                    where: {
                        id: el.Drug.id
                    }
                }, { transaction: t });
            })
            await ShoppingCart.update({
                isPaid: true
            }, {
                where: {
                    UserId: +user.id,
                }
            }, { transaction: t });
            res.status(200).json({
                message: 'you have success pay with amount of ' + totalPrice
            })
            await t.commit()
        } catch (err) {
            await t.rollback()
            next(err)
        }
    }

    static async restockDrug(req, res, next) {
        try {
            const { stock } = req.body;
            const { id } = req.params;
            const drug = await Drug.findByPk(id);
            if(!drug) {
                throw ({name: "NOT_FOUND", message: 'medicine not found'});
            }
            const user = await User.findByPk(req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            if(user.role !== 'admin') {
                throw ({name: "FORBIDDEN", message: 'Forbidden'});
            }
            await Drug.update({
                stock: +drug.stock + +stock
            }, {
                where: {
                    id: drug.id
                }
            });
            res.status(200).json({
                message: 'medicine restocked'
            })
        } catch (err) {
            next(err)
        }
    }

    static async deleteDrug(req, res, next) {
        try {
            const { id } = req.params;
            const drug = await Drug.findByPk(id);
            if(!drug) {
                throw ({name: "NOT_FOUND", message: 'medicine not found'});
            }
            const user = await User.findByPk(req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            const shoppingCart = await ShoppingCart.destroy({
                where: {
                    userId: user.id,
                    drugId: drug.id
                }
            });
            res.status(200).json({
                message: 'medicine deleted from shopping cart'
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = DrugController;