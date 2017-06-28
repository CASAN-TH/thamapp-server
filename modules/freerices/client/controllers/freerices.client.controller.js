(function () {
  'use strict';

  // Freerices controller
  angular
    .module('freerices')
    .controller('FreericesController', FreericesController);

  FreericesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'freericeResolve', 'ProductsService', 'OrdersService', '$http'];

  function FreericesController($scope, $state, $window, Authentication, freerice, ProductsService, OrdersService, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.freerice = freerice;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.orders = [];
    $scope.prod = ProductsService.get({
      productId: '592d1f638e705ac02fa47db7'
    });
    console.log($scope.prod);
    // Remove existing Freerice

    vm.execute = function (documents) {
      if (documents) {
        var users = JSON.parse(JSON.stringify(eval("(" + documents + ")")));
        if (users && users.length > 0) {
          users.forEach(function (user) {
            var item = {
              product: $scope.prod,
              price: $scope.prod.price,
              qty: 1,
              retailerprice: $scope.prod.retailerprice,
              amount: $scope.prod.price,
              deliverycost: 50,
              discountamount: 100
            };
            var _order = {};
            _order.remark = 'ส่งข้าวให้คนลงขัน ไม่ต้องเก็บเงิน ***บริษัทจ่ายค่าส่งให้คนส่งข้าว***';
            _order.delivery = { deliveryid: '0' };
            _order.items = [];
            _order.src = 'batch2';
            _order.docno = (+ new Date());
            _order.docdate = new Date();
            _order.items.push(item); // item is product
            _order.shipping = {};
            _order.shipping.firstname = user.firstName;
            _order.shipping.lastname = user.lastName;
            _order.shipping.address = user.address.address;
            _order.shipping.postcode = user.address.postcode;
            _order.shipping.subdistrict = user.address.subdistrict;
            _order.shipping.district = user.address.district;
            _order.shipping.province = user.address.province;
            _order.shipping.tel = user.address.tel;
            _order.shipping.email = user.email;
            _order.historystatus = [{
              status: 'confirmed',
              datestatus: new Date()
            }];
            _order.amount = 50;
            _order.deliveryamount = 50;
            _order.discountpromotion = 100;
            _order.totalamount = 0;

            var fullAddress = _order.shipping.address.replace(' ', '+') + '+' + _order.shipping.subdistrict + '+' + _order.shipping.district + '+' + _order.shipping.province + '+' + _order.shipping.postcode;

            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
              if (response.status.toUpperCase() === 'OK') {
                _order.shipping.sharelocation = {};
                _order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
                _order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;

              }

              vm.orders.push(_order);
              console.log(vm.orders);

              // $http.post('/api/orders', _order).success(function (order) {
              //   console.log('order success');
              // }).error(function (error) { // save order
              //   console.log(JSON.stringify(invester));
              // });

            }).error(function (err) { //get location
              console.log(err);
            });
          });
        }
      }
      // var users = JSON.parse(documents);
      // console.log(users);

      alert('execute');
    };

    vm.clears = function () {
      alert('clear');
    };

    vm.submits = function () {

    };


    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.freerice.$remove($state.go('freerices.list'));
      }
    }

    // Save Freerice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.freericeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.freerice._id) {
        vm.freerice.$update(successCallback, errorCallback);
      } else {
        vm.freerice.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('freerices.view', {
          freericeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
