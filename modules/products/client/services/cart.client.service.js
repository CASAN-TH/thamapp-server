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

    function CartItem(product, price, qty, amount) {
        this.product = product;
        this.price = price;
        this.qty = qty;
        this.amount = amount;

    }
    function Cart(cartName) {
        this.cartName = cartName;
        this.items = [];
        this.load();

        this.save();

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
            }
        }

        if (!found) {
            var _item = new CartItem(product, product.price, 1, product.price);
            this.items.push(_item);

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
    Cart.prototype.clear = function () {
        this.items = [];
        this.save();
    };
} ());
