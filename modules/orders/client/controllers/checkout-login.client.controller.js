(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutLoginController', CheckoutLoginController);

  CheckoutLoginController.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'ShopCartService', 'OrdersService', 'orderResolve', 'PostcodesService', 'Users', '$timeout'];

  function CheckoutLoginController($scope, $state, $http, $location, $window, Authentication, ShopCartService, OrdersService, orderResolve, PostcodesService, Users, $timeout) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = ShopCartService.cart;
    vm.error = null;
    vm.form = {};
    vm.checkout = {};
    vm.order = orderResolve;
    vm.order.delivery = { deliveryid: '0' };
    vm.order.shipping = {};
    vm.order.shipping.sharelocation = {};
    vm.isMember = false;
    $scope.step = $scope.authentication.user ? 2 : 1;
    $scope.credentials = {};
    $scope.postcodedata = {};
    $scope.newAddress = { status: false };
    $scope.authentication.address = {};
    $scope.user = Authentication.user;
    if ($scope.user && $scope.user.roles[0] === 'admin') {
      $scope.newAddress.status = true;
    }

    // Update a user profile
    vm.clear = function () {
      vm.cart.clear();
      $timeout(function () {
        $state.go('home');
      }, 400);
    };

    vm.saveprod = function () {
      if (vm.order.shipping.sharelocation) {
        vm.order.shipping.sharelocation = vm.order.shipping.sharelocation;
      } else {
        vm.order.shipping.sharelocation = {};
      }
      vm.order.totalamount = 0;
      vm.order.items = [];
      vm.order.src = 'web';
      //var getAllOrder = OrdersService.query();
      //vm.order.docno = new Date().getFullYear() + '' + new Date().getMonth() + '' + (getAllOrder.length + 1);
      vm.order.docno = (+ new Date());
      vm.order.docdate = new Date();
      // vm.order.discountpromotion = vm.result || 0;
      // products
      var getItems = vm.cart.items;
      getItems.forEach(function (item) {
        item.deliverycost += item.qty * 150;
        vm.order.items.push(item);
      });
      // address contact
      vm.order.shipping.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
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
        vm.order.shipping.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
      }
      vm.order.amount = $scope.pricefalse;
      vm.order.deliveryamount = $scope.deliverycostfalse;
      vm.order.discountpromotion = $scope.discountamountfalse;
      vm.order.totalamount = $scope.amountfalse;

      var fullAddress = vm.order.shipping.address.replace(' ', '+') + '+' + vm.order.shipping.subdistrict + '+' + vm.order.shipping.district + '+' + vm.order.shipping.province + '+' + vm.order.shipping.postcode;

      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
        if (response.status.toUpperCase() === 'OK') {
          vm.order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
          vm.order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;
          if (vm.order._id) {
            vm.order.$update(successCallback, errorCallback);
          } else {
            vm.order.$save(successCallback, errorCallback);
          }
        } else {
          //alert('กรุณากรอกที่อยู่ที่ถูกต้อง!');
          if (vm.order._id) {
            vm.order.$update(successCallback, errorCallback);
          } else {
            vm.order.$save(successCallback, errorCallback);
          }
        }
        function successCallback(res) {
          if (!$scope.authentication.user.address.tel) {
            $scope.authentication.user.address.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
            var user = new Users($scope.authentication.user);

            user.$update(function (response) {
              console.log('update user profile success');
            }, function (response) {
              console.log(response.data.message);
            });
          }
          vm.cart.clear();
          $timeout(function () {
            $state.go('complete', {
              orderId: res._id
            });
          }, 400);
        }

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }).error(function (err) {
        console.log(err);
      });
    };

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
          var postcode = '';
          var province = '';
          if (!$scope.newAddress.status) {
            postcode = $scope.user.address.postcode ? $scope.user.address.postcode : '';
            province = $scope.user.address.province ? $scope.user.address.province : '';
          } else {
            postcode = vm.order.shipping.postcode ? vm.order.shipping.postcode : '';
            province = vm.order.shipping.province ? vm.order.shipping.province : '';
          }

          if (province === 'กรุงเทพมหานคร') {
            $scope.saveOrder();
          } else {
            // alert('postcode' + postcode);
            $http.get('/api/checkPostcode/' + postcode).success(function (res) {
              vm.order.inarea = res.area;
              if (res.area) {
                $scope.saveOrder();
              } else {
                // $scope.saveOrder();
                // alert('อยู่นอกพื้นที่การจัดส่ง');
                $scope.pricefalse = 0;
                $scope.amountfalse = 0;
                $scope.deliverycostfalse = 0;
                $scope.discountamountfalse = 0;

                vm.cart.items.forEach(function (item) {
                  console.log(vm.cart.items);
                  $scope.pricefalse += item.price * item.qty;
                  $scope.deliverycostfalse += item.qty * 150;
                  $scope.discountamountfalse += item.discountamount;
                  $scope.amountfalse = ($scope.pricefalse + $scope.deliverycostfalse) - $scope.discountamountfalse;

                });
                $('#false').modal();

              }

            }).error(function (res) {

            });
          }

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

        if ($scope.authentication.user.address.postcode) {
          $scope.authentication.user.address.district = postcode.district;
          $scope.authentication.user.address.subdistrict = postcode.subdistrict;
          $scope.authentication.user.address.province = postcode.province;
        } else {
          $scope.authentication.user.address.district = '';
          $scope.authentication.user.address.province = '';
          $scope.authentication.user.address.subdistrict = '';
        }
      }
    };

    $scope.updateUserProfile = function (data) {
      $scope.user.address = $scope.authentication.user.address ? $scope.authentication.user.address : {};
      $scope.user.address.address = data.address;
      $scope.user.address.district = data.district;
      $scope.user.address.subdistrict = data.subdistrict;
      $scope.user.address.province = data.province;
      $scope.user.address.postcode = data.postcode;
      $scope.user.address.tel = data.tel;
      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    // vm.checklocation = function () {

    $scope.chkStatus = function (status) {
      $scope.newAddress = { status: status };
    };

    $scope.saveOrder = function () {
      if (vm.order.shipping.sharelocation) {
        vm.order.shipping.sharelocation = vm.order.shipping.sharelocation;
      } else {
        vm.order.shipping.sharelocation = {};
      }
      vm.order.totalamount = 0;
      vm.order.items = [];
      vm.order.src = 'web';
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
      vm.order.shipping.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
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
        vm.order.shipping.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
      }
      vm.order.amount = vm.cart.getTotalPrice();
      vm.order.deliveryamount = vm.cart.getTotalDeliveryCost();
      vm.order.discountpromotion = vm.cart.getTotalDiscount();
      vm.order.totalamount = vm.order.amount + vm.order.deliveryamount - vm.order.discountpromotion;

      var fullAddress = vm.order.shipping.address.replace(' ', '+') + '+' + vm.order.shipping.subdistrict + '+' + vm.order.shipping.district + '+' + vm.order.shipping.province + '+' + vm.order.shipping.postcode;

      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
        if (response.status.toUpperCase() === 'OK') {
          vm.order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
          vm.order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;
          if (vm.order._id) {
            vm.order.$update(successCallback, errorCallback);
          } else {
            vm.order.$save(successCallback, errorCallback);
          }
        } else {
          //alert('กรุณากรอกที่อยู่ที่ถูกต้อง!');
          if (vm.order._id) {
            vm.order.$update(successCallback, errorCallback);
          } else {
            vm.order.$save(successCallback, errorCallback);
          }
        }
        function successCallback(res) {
          if (!$scope.authentication.user.address.tel) {
            $scope.authentication.user.address.tel = vm.order.shipping.tel || $scope.authentication.user.address.tel;
            var user = new Users($scope.authentication.user);

            user.$update(function (response) {
              console.log('update user profile success');
            }, function (response) {
              console.log(response.data.message);
            });
          }
          vm.cart.clear();
          $state.go('complete', {
            orderId: res._id
          });
        }

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }).error(function (err) {
        console.log(err);
      });
    };
    // $scope.postcode = [{ name: 'test' }];
    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      // if ($state.previous && $state.previous.href) {
      //   url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      // }
      url += '?redirect_to=/checkout-login';

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    $scope.init = function () {
      $scope.postcodeQuery = PostcodesService.query();
      $scope.postcode = $scope.postcodeQuery;
    };
  }
})();
