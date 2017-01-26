// Products service used to communicate Products REST endpoints
(function () {
    'use strict';

    angular
        .module('products')
        .factory('ShopCartService', ShopCartService);

    function ShopCartService() {
        var myCart = new Cart('myCart');
        return {
            cart: myCart
        };
    }

    function CartItem(product, price, qty, amount, deliverycost, discountamount) {
        this.product = product;
        this.price = price;
        this.qty = qty;
        this.amount = amount;
        this.deliverycost = deliverycost;
        this.discountamount = discountamount;

    }
    function Cart(cartName) {
        this.cartName = cartName;
        this.items = [];
        this.load();

        this.save();

    }

    function deliveryRang(arrRang, qty) {
        var result = 0;
        arrRang.forEach(function (rang) {
            if (qty >= rang.min && qty <= rang.max) {
                result = rang.value;
            }
        });
        return result;
    }

    Cart.prototype.load = function () {
        var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
        if (items !== null && JSON !== null) {
            try {
                items = JSON.parse(items);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.product !== null && item.price !== null && item.qty !== null && item.amount !== null) {
                        item = new CartItem(item.product, item.price, item.qty, item.amount);
                        this.items.push(item);
                    }
                }
            } catch (error) {

            }
            return items;
        }
    };
    Cart.prototype.add = function (product) {
        var found = false;

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item.product._id === product._id) {
                found = true;
                item.qty += 1;
                item.amount = item.price * item.qty;
                //item.deliverycost = item.qty * item.product.valuetype1;
                if (item.product.deliveryratetype === 0) {
                    item.deliverycost = 0;
                } else if (item.product.deliveryratetype === 1) {
                    item.deliverycost = item.qty * item.product.valuetype1;
                } else if (item.product.deliveryratetype === 2) {
                    item.deliverycost = deliveryRang(item.product.rangtype2, item.qty);
                }

                item.discountamount = getDiscountPro(item.product.promotions, item.qty);
            }
        }

        if (!found) {
            var dcost = 0;
            if (product.deliveryratetype === 0) {
                dcost = 0;
            } else if (product.deliveryratetype === 1) {
                dcost = product.valuetype1;
            } else if (product.deliveryratetype === 2) {
                dcost = deliveryRang(product.rangtype2, 1);
            }

            var disc = getDiscountPro(product.promotions, 1);
            var _item = new CartItem(product, product.price, 1, product.price, dcost, disc);
            this.items.push(_item);

        }
        this.save();
    };
    function getDiscountPro(promotions, qty) {
        var sum = 0;

        if (promotions) {
            promotions.forEach(function (promotion) {
                if (qty >= promotion.condition) {
                    var resultQty = parseInt(qty / (promotion.condition || 1));
                    if (promotion.discount.fixBath > 0) {
                        sum += promotion.discount.fixBath * resultQty;
                    }
                }
            });
        }
        return sum;
    }
    Cart.prototype.getTotalDeliveryCost = function (code) {
        var total = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (code === null || item.code === code) {
                total += item.deliverycost;
            }
        }
        return total;
    };

    Cart.prototype.getTotalDiscount = function (code) {
        var total = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (code === null || item.code === code) {
                total += item.discountamount;
            }
        }
        return total;
    };

    Cart.prototype.remove = function (product) {
        var found = false;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item.product._id === product._id) {
                found = true;
                item.qty -= 1;
                item.amount = item.price * item.qty;
                if (item.qty <= 0) {
                    item.qty = 1;
                    //this.items.splice(i, 1);
                }
                if (item.product.deliveryratetype === 0) {
                    item.deliverycost = 0;
                } else if (item.product.deliveryratetype === 1) {
                    item.deliverycost = item.qty * item.product.valuetype1;
                } else if (item.product.deliveryratetype === 2) {
                    item.deliverycost = deliveryRang(item.product.rangtype2, item.qty);
                }
                item.discountamount = getDiscountPro(item.product.promotions, item.qty);
            }
        }

        this.save();
    };

    Cart.prototype.removeItem = function (product) {
        var found = false;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item.product._id === product._id) {
                found = true;
                this.items.splice(i, 1);
            }
        }

        this.save();
    };

    Cart.prototype.save = function (product) {

        if (localStorage !== null && JSON !== null) {
            localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
        }
    };
    // get the total price for all items currently in the cart
    Cart.prototype.getTotalPrice = function (code) {
        var total = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (code === null || item.code === code) {
                total += item.price * item.qty;
            }
        }
        return total;
    };

    // get the total price for all items currently in the cart
    Cart.prototype.getTotalCount = function (code) {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (code === null || item.code === code) {
                count += item.qty;
            }
        }
        return count;
    };

    Cart.prototype.getTotalItemsCount = function (_id) {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (_id === null || item.product._id === _id) {
                count += item.qty;
            }
        }
        return count;
    };

    Cart.prototype.clear = function () {
        this.items = [];
        this.save();
    };
} ());
