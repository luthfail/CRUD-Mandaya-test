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
            const drug = await Drug.create({
                name,
                price,
                stock
            });
            res.status(201).json({
                message: 'medicine added',
                drug
            })
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
                userId: user.id,
                drugId: drug.id,
            });
            res.status(201).json({
                message: 'medicine added to shopping cart, waiting to be paid'
            })
        } catch (err) {
            next(err)
        }
    }

    static async payment(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const user = await User.findByPk(req.user.id, { transaction: t });
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            const shoppingCart = await ShoppingCart.findAll({
                where: {
                    userId: user.id
                }
            }, { transaction: t });
            if(!shoppingCart) {
                throw ({name: "NOT_FOUND", message: 'Shopping cart is empty'});
            }
            const drugs = await Drug.findAll({
                where: {
                    id: shoppingCart.map(item => item.drugId)
                }
            }, { transaction: t });
            if(!drugs) {
                throw ({name: "NOT_FOUND", message: 'medicine not found'});
            }
            const totalPrice = drugs.reduce((acc, curr) => acc + curr.price, 0);
            if(user.balance < totalPrice) {
                throw ({name: 'INVALID', message: 'Insufficient balance'});
            }
            await Drug.update({
                stock: drugs.map(item => item.stock - 1)
            }, {
                where: {
                    id: drugs.map(item => item.id)
                }
            }, { transaction: t });
            await ShoppingCart.update({
                isPaid: true
            }, {
                where: {
                    userId: user.id
                }
            }, { transaction: t });
            res.status(200).json({
                message: 'Payment success'
            })
            await t.commit();
        } catch (err) {
            await t.rollback();
            next(err)
        }
    }

    static async getShoppingCart(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            if(!user) {
                throw ({name: "NOT_FOUND", message: 'User not found'});
            }
            if(user.role === 'admin') {
                const shoppingCart = await ShoppingCart.findAll({
                    include: [{
                        model: Drug
                    }],
                    where: {
                        isPaid: true
                    }
                });
                const totalIncome = shoppingCart.reduce((acc, curr) => acc + curr.drug.price, 0);
                const unpaid = await ShoppingCart.findAll({
                    include: [{
                        model: Drug
                    }],
                    where: {
                        isPaid: false
                    }
                });
                const expectedIncome = unpaid.reduce((acc, curr) => acc + curr.drug.price, 0);
                res.status(200).json({
                    shoppingCart,
                    totalIncome,
                    unpaid,
                    expectedIncome,
                })
            } else if(user.role === 'user') {
                const shoppingCart = await ShoppingCart.findAll({
                    include: [{
                        model: Drug
                    }],
                    where: {
                        userId: user.id,
                        isPaid: false
                    }
                });
                const totalPrice = shoppingCart.reduce((acc, curr) => acc + curr.drug.price, 0);
                res.status(200).json({
                    shoppingCart,
                    totalPrice
                })
            }
        } catch (err) {
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
                stock: drug.stock + stock
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