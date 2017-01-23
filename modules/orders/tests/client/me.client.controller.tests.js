'use strict';

(function () {
  // Me Controller Spec
  describe('Me Controller Tests', function () {
    // Initialize global variables
    var MeController,
      $scope,
      $httpBackend,
      $stateParams,
      OrdersService,
      mockOrder,
      $location;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _OrdersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      OrdersService = _OrdersService_;

      // Initialize the Me controller.
      MeController = $controller('MeController as vm', {
        $scope: $scope
      });
      mockOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'wait deliver',
        delivery: {
          deliveryid: '0'
        }
      });
    }));

    describe('order status cancel', function () {

      beforeEach(function () {
        $scope.vm.history = mockOrder;
        $scope.vm.history.historystatus = [{
          status: 'wait deliver',
          datestatus: '10/11/2015'
        }];
      });

      it('should send a GET request and return all Orders cancel status', inject(function () {
        $scope.vm.cancelOrder($scope.vm.history);
        // Test form inputs are reset
        expect($scope.vm.history.deliverystatus).toEqual('cancel');
      }));
    });

  });
} ());
