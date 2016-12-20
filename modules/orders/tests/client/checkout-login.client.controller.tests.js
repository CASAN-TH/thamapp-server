'use strict';

(function () {
  // Checkout login Controller Spec
  describe('Checkout login Controller Tests', function () {
    // Initialize global variables
    var CheckoutLoginController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      mockOrder,
      OrdersService;

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

      mockOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        docno: '1234'
      });
      // Initialize the Checkout login controller.
      CheckoutLoginController = $controller('CheckoutLoginController', {
        $scope: $scope,
        orderResolve: {}
      });
    }));


    describe('Signup', function () {
      it('Should be Step first', function () {
        expect($scope.step).toBe(1);
      });

      it('Should be Next Step not signin not email', function () {
        $scope.checkStep(false);
        expect($scope.step).toBe(1);
      });

      it('Should be Next Step not signin has email', function () {
        $scope.checkStep(true);
        expect($scope.step).toBe(2);
      });

      it('Should be Next Step not signin not first name last name and address', function () {
        $scope.step = 2;
        $scope.checkStep(false);
        expect($scope.step).toBe(2);
      });

      // it('Should be Next Step not signin has first name last name and address', function () {
      //   $scope.step = 2;
      //   $scope.checkStep(true);
      //   expect($scope.step).toBe(3);
      // });

      it('should register with correct data', function (authentication) {
        // Test expected GET request
        $scope.step = 2;
        $scope.authentication.user = 'Fred';
        $httpBackend.when('POST', '/api/auth/signup').respond(200, 'Fred');

        $scope.signup(true);
        $httpBackend.flush();
        expect($scope.step).toBe(3);
        // test scope value
        expect($scope.authentication.user).toBe('Fred');
        expect($scope.error).toEqual(null);
      });

      it('should login with a correct user and password', function () {
        // Test expected GET request
        $scope.step = 2;
        $httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

        $scope.signin(true);
        $httpBackend.flush();
        expect($scope.step).toBe(3);
        // Test scope value
        expect($scope.authentication.user).toEqual('Fred');
      });

    });

    // describe('vm.save() as create', function () {
    //   // $scope.authentication = {
    //   //   user: {
    //   //     firstName: 'Firstname',
    //   //     lastName: 'lastName',
    //   //     address: {
    //   //       address: 'address',
    //   //       postcode: 'postcode',
    //   //       subdistrict: 'subdistrict',
    //   //       province: 'province',
    //   //       district: 'district',
    //   //       tel: 'tel',
    //   //       email: 'email'
    //   //     }
    //   //   }
    //   // };

    //   var sampleOrderPostData;

    //   beforeEach(function () {
    //     // Create a sample Order object
    //     sampleOrderPostData = new OrdersService({
    //       docno: '1234'
    //     });

    //     $scope.vm.order = sampleOrderPostData;
    //   });
    //   it('should send a POST request with the form input values and then locate to new object URL', inject(function (OrdersService) {
    //     // Set POST response
    //     $httpBackend.expectPOST('api/orders', sampleOrderPostData).respond(mockOrder);

    //     // Run controller functionality
    //     $scope.saveOrder(true);
    //     $httpBackend.flush();
    //   }));
    // });

  });
} ());
