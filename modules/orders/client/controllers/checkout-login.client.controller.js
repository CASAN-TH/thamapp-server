(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutLoginController', CheckoutLoginController);

  CheckoutLoginController.$inject = ['$scope', 'Authentication', 'ShopCartService', '$http', 'OrdersService', 'orderResolve', '$state', 'PostcodesService', 'PromotionsService'];

  function CheckoutLoginController($scope, Authentication, ShopCartService, $http, OrdersService, orderResolve, $state, PostcodesService, PromotionsService) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = ShopCartService.cart;
    vm.error = null;
    vm.form = {};
    vm.checkout = {};
    vm.order = orderResolve;
    vm.order.delivery = { deliveryid: '0' };
    vm.order.shipping = {};
    vm.isMember = false;
    $scope.step = $scope.authentication.user ? 2 : 1;
    $scope.credentials = {};
    $scope.postcodedata = {};
    $scope.products = product;
    $scope.newAddress = { status: false };
    $scope.authentication.address = {};
    vm.Promotion = Promotion;
    vm.promotions = [];
    vm.checkPromotion = checkPromotion;
    vm.initPromotion = initPromotion;
    vm.order.discountpromotion = 0;
    function Promotion() {
      PromotionsService.query(function (data) {
        angular.forEach(data, function (res) {
          vm.promotions.push(res);
        });
      });
      // vm.promotions = vm.promotion.resolve();
    }

    function initPromotion() {
      var product = {};
      var qty = 0;
      vm.cart.items.forEach(function (item) {
        product = item.product;
        qty = item.qty;
        vm.checkPromotion(product, qty, item);
      });
    }



    function checkPromotion(product, qty, item) {
      // vm.order.discountpromotion = 0;
      $http.get('api/promotions/productid/' + product._id + '/' + qty).success(function (response) {
        vm.order.discountpromotion += response.total - (vm.order.discountpromotion || 0);
      }).error(function (err) {
        console.log(err);
      });
    }
    function product() {

    }

    $scope.checkStep = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.checkoutForm');
        return false;
      }
      if ($scope.step === 1) {
        if (vm.isMember) {
          $scope.signin(isValid);
        } else if ($scope.authentication.user && $scope.step === 2) {
          $scope.step += 1;
        } else {
          $scope.signin(isValid);
        }


      } else {
        if ($scope.authentication.user) {
          $scope.saveOrder();
        }
        else {
          $scope.signup(isValid);
        }

      }
    };

    $scope.signup = function (isValid) {
      $scope.authentication.password = 'Usr#Pass1234';
      $scope.authentication.email = $scope.authentication.username + '@thamapp.com';
      $scope.authentication.address.tel = $scope.authentication.username;
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.authentication).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // $scope.step += 1;
        // And redirect to the previous or home page
      }).error(function (response) {
        //$scope.error = response.message;

      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;
      if (!vm.isMember) {
        $scope.authentication.password = 'Usr#Pass1234';
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.authentication).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $scope.step += 1;
      }).error(function (response) {
        $scope.error = response.message;
        if (!vm.isMember) {
          $scope.step += 1;
        }
      });
    };

    $scope.callbackOrder = function (postcode) {
      $scope.checkAutocomplete(postcode, true);
    };

    $scope.callback = function (postcode) {
      $scope.checkAutocomplete(postcode);
    };

    $scope.checkAutocomplete = function (postcode, order) {
      if (order) {
        if (postcode) {
          vm.order.shipping.district = postcode.district;
          vm.order.shipping.subdistrict = postcode.subdistrict;
          vm.order.shipping.province = postcode.province;
        } else {
          vm.order.shipping.district = '';
          vm.order.shipping.province = '';
          vm.order.shipping.subdistrict = '';
        }
      } else {
        if ($scope.authentication.address.postcode) {
          $scope.authentication.address.district = postcode.district;
          $scope.authentication.address.subdistrict = postcode.subdistrict;
          $scope.authentication.address.province = postcode.province;
        } else {
          $scope.authentication.address.district = '';
          $scope.authentication.address.province = '';
          $scope.authentication.address.subdistrict = '';
        }
      }
    };

    $scope.saveOrder = function () {
      vm.order.totalamount = 0;
      vm.order.items = [];
      //var getAllOrder = OrdersService.query();
      //vm.order.docno = new Date().getFullYear() + '' + new Date().getMonth() + '' + (getAllOrder.length + 1);
      vm.order.docno = (+ new Date());
      vm.order.docdate = new Date();
      // vm.order.discountpromotion = vm.result || 0;
      // products
      var getItems = vm.cart.items;
      getItems.forEach(function (item) {
        vm.order.items.push(item);
      });
      // address contact
      vm.order.shipping.tel = $scope.authentication.user.address.tel;
      vm.order.shipping.email = $scope.authentication.user.email;

      //////status/////
      vm.order.historystatus = [{
        status: 'confirmed',
        datestatus: new Date()
      }];

      if ($scope.newAddress.status === false) {
        vm.order.shipping.firstname = $scope.authentication.user.firstName;
        vm.order.shipping.lastname = $scope.authentication.user.lastName;
        vm.order.shipping.address = $scope.authentication.user.address.address;
        vm.order.shipping.postcode = $scope.authentication.user.address.postcode;
        vm.order.shipping.subdistrict = $scope.authentication.user.address.subdistrict;
        vm.order.shipping.province = $scope.authentication.user.address.province;
        vm.order.shipping.district = $scope.authentication.user.address.district;
      }
      vm.order.amount = vm.cart.getTotalPrice();
      vm.order.totalamount = vm.order.amount - vm.order.discountpromotion;
      // ยังไม่รู้จะใส่ยังไง

      // delivery: {
      //   deliveryid: String,
      //   deliveryname: String,
      //   deliverylog: [{
      //     logdate: Date,
      //     detail: String
      //   }]
      // },
      // weight: String,
      // deliveryamount: Number,
      // totalamount: Number,
      // cartdate: Date,
      // deliverystatus: String,
      // drilldate: Date,
      // deliverylog: [{
      //   logdate: Date,
      //   detail: String
      // }],

      // TODO: move create/update logic to service
      if (vm.order._id) {
        vm.order.$update(successCallback, errorCallback);
      } else {
        vm.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $scope.step += 1;
        vm.cart.clear();
        $state.go('complete', {
          orderId: res._id
        });
        // vm.checkout = res;
        // vm.checkout.allQty = 0;
        // res.items.forEach(function (item) {
        //   vm.checkout.allQty += item.qty;
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    // $scope.postcode = [{ name: 'test' }];


    $scope.init = function () {
      $scope.postcodeQuery = PostcodesService.query();
      $scope.postcode = $scope.postcodeQuery;
    };
  }
})();
