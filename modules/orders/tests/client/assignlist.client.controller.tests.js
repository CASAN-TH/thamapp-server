'use strict';

(function () {
  // Assignlist Controller Spec
  describe('Assignlist Controller Tests', function () {
    // Initialize global variables
    var AssignlistController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      Users,
      Authentication,
      OrdersService,
      mockOrder,
      mockOrder2,
      mockOrder3,
      mockOrder4,
      mockDeliver;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, _$stateParams_, _$location_, $rootScope, _$state_, _$httpBackend_, _Users_, _Authentication_, _OrdersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Users = _Users_;
      Authentication = _Authentication_;
      OrdersService = _OrdersService_;

      mockDeliver = new Users({
        _id: '585a0a624b1d9cd80e439b3e',
        salt: 'g2K5zNV8Jgx+/AxyZcbiUw==',
        displayName: 'deliver2 deliver2',
        provider: 'local',
        username: 'deliver2',
        __v: 0,
        created: '2016-12-21T04:51:46.142Z',
        roles: [
          'deliver'
        ]
      });

      mockOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        namedeliver: {
          _id: '123456'
        },
        deliverystatus: 'confirmed'
      });

      mockOrder2 = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        namedeliver: {
          _id: '123456'
        },
        deliverystatus: 'accept'
      });

      mockOrder3 = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        namedeliver: {
          _id: '123456'
        },
        deliverystatus: 'complete'
      });

      mockOrder4 = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        namedeliver: {
          _id: '123456'
        },
        deliverystatus: 'reject'
      });


      Authentication.user = {
        roles: ['deliver']
      };

      // Initialize the Assignlist controller.
      AssignlistController = $controller('AssignlistController as vm', {
        $scope: $scope
      });
    }));

    describe('list order as read', function () {
      var mockOrderList;

      beforeEach(function () {
        mockOrderList = [mockOrder, mockOrder, mockOrder];
      });

      it('should send a GET request and return all order', inject(function (OrdersService) {

        $httpBackend.expectGET('api/orders').respond(mockOrderList);
        $httpBackend.flush();

        expect($scope.vm.orders.length).toEqual(3);
        expect($scope.vm.orders[0]).toEqual(mockOrder);
        expect($scope.vm.orders[1]).toEqual(mockOrder);
        expect($scope.vm.orders[2]).toEqual(mockOrder);

      }));
    });

    describe('vm.addHis', function () {

      beforeEach(function () {
        $scope.vm.orders.historystatus = [{
          status: 'pending',
          datestatus: '10/11/2015'
        }];
      });

      it('should addHis', function () {
        $scope.vm.addHis($scope.vm.orders);

        expect($scope.vm.orders.historystatus[0].status).toEqual('pending');
      });


    });
    describe('update status accept', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.orders = mockOrder2;
        $scope.vm.orders.historystatus = [{
          status: 'accept',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status accept()', inject(function () {


        // Run controller functionality
        $scope.vm.accept($scope.vm.orders);
        expect($scope.vm.orders.deliverystatus).toEqual('accept');
        expect($scope.vm.orders.historystatus[0].status).toEqual('accept');
        $scope.vm.addHis($scope.vm.orders);
        // $httpBackend.flush();

      }));
    });

    describe('update status complete', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.orders = mockOrder4;
        $scope.vm.orders.historystatus = [{
          status: 'sent',
          datestatus: '10/11/2015'
        }, {
          status: 'pending',
          datestatus: '10/11/2015'
        }, {
          status: 'paid',
          datestatus: '10/11/2015'
        }, {
          status: 'complete',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status complete()', inject(function () {


        // Run controller functionality
        $scope.vm.complete($scope.vm.orders);
        expect($scope.vm.orders.deliverystatus).toEqual('complete');
        expect($scope.vm.orders.historystatus[0].status).toEqual('sent');
        $scope.vm.addHis($scope.vm.orders);
        expect($scope.vm.orders.historystatus[1].status).toEqual('pending');
        $scope.vm.addHis($scope.vm.orders);
        expect($scope.vm.orders.historystatus[2].status).toEqual('paid');
        $scope.vm.addHis($scope.vm.orders);
        expect($scope.vm.orders.historystatus[3].status).toEqual('complete');
        $scope.vm.addHis($scope.vm.orders);
        // $httpBackend.flush();

      }));
    });
    describe('update status reject', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.orders = mockOrder4;
        $scope.vm.orders.historystatus = [{
          status: 'reject',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status reject()', inject(function () {

        // Run controller functionality
        $scope.vm.reject($scope.vm.orders);
        expect($scope.vm.orders.deliverystatus).toEqual('reject');
        expect($scope.vm.orders.historystatus[0].status).toEqual('reject');
        $scope.vm.addHis($scope.vm.orders);
        // $httpBackend.flush();

      }));
    });

  });
}());
