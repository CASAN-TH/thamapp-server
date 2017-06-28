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
    vm.pushError = [];
    var i = 0;
    var Orlength = 0;
    // Remove existing Freerice

    vm.execute = function (documents) {
      vm.orders = [];
      i = 0;
      var remarkSrc = (+ new Date());
      if (documents) {
        var users = JSON.parse(documents);
        if (users && users.length > 0) {
          Orlength = users.length;
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
            _order.src = 'batch2 : ' + remarkSrc;
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
            _order.displayname = user.firstName + ' ' + user.lastName;
            // _order.img = 'http://res.cloudinary.com/hflvlav04/image/upload/v1487834187/g3hwyieb7dl7ugdgj3tb.png';

            var fullAddress = _order.shipping.address.replace(' ', '+') + '+' + _order.shipping.subdistrict + '+' + _order.shipping.district + '+' + _order.shipping.province + '+' + _order.shipping.postcode;

            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
              if (response.status.toUpperCase() === 'OK') {
                _order.shipping.sharelocation = {};
                _order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
                _order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;

              }
              var postcode = _order.shipping.postcode === '' ? '00000' : _order.shipping.postcode;
              if (_order.shipping && _order.shipping.province === 'กรุงเทพมหานคร') {
                _order.inarea = true;
              } else {
                $http.get('/api/checkPostcode/' + postcode).success(function (res) {
                  _order.inarea = res.area;
                });
              }

              vm.orders.push(_order);




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
    };

    vm.clears = function () {
      $scope.execute = null;
      vm.orders = null;
    };

    vm.submits = function () {
      if (vm.orders && vm.orders.length > 0) {
        vm.orders[i].docno = (+ new Date());
        $http.post('/api/orders', vm.orders[i]).then(function (res) {
          i++;
          if (i === Orlength) {
            return;
          } else {
            vm.submits();
          }
          console.log(i);
        }, function (err) {
          vm.pushError.push(vm.orders[i]);
          i++;
          console.log(vm.pushError);
          alert(err.message);
        });
      }
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
