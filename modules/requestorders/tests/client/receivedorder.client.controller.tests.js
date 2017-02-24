'use strict';

(function () {
  // Receivedorder Controller Spec
  describe('Receivedorder Controller Tests', function () {
    // Initialize global variables
    var ReceivedorderController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      Users,
      Authentication,
      RequestordersService,
      mockOrderRequest2;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$state_, _Users_, _Authentication_, _RequestordersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Users = _Users_;
      Authentication = _Authentication_;
      RequestordersService = _RequestordersService_;

      mockOrderRequest2 = new RequestordersService({
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
        deliverystatus: 'received'
      });

      Authentication.user = {
        roles: ['deliver']
      };

      // Initialize the Receivedorder controller.
      ReceivedorderController = $controller('ReceivedorderController as vm', {
        $scope: $scope
      });
    }));

    describe('vm.addHis', function () {
      beforeEach(function () {
        $scope.vm.requestorders.historystatus = [{
          status: 'received',
          datestatus: '10/11/2015'
        }];
      });

      it('should addHis', function () {
        $scope.vm.addHis($scope.vm.requestorders);

        expect($scope.vm.requestorders.historystatus[0].status).toEqual('received');
      });
    });

    describe('update status received', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.requestorders = mockOrderRequest2;
        $scope.vm.requestorders.historystatus = [{
          status: 'received',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status received()', inject(function () {


        // Run controller functionality
        $scope.vm.receive($scope.vm.requestorders);
        expect($scope.vm.requestorders.deliverystatus).toEqual('received');
        expect($scope.vm.requestorders.historystatus[0].status).toEqual('received');
        $scope.vm.addHis($scope.vm.requestorders);
        // $httpBackend.flush();

      }));
    });

  });
}());
