'use strict';

(function () {
  // Deliver Controller Spec
  describe('Deliver Controller Tests', function () {
    // Initialize global variables
    var DeliverController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      PostcodesService,
      mockPostcode;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _PostcodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      PostcodesService = _PostcodesService_;

      mockPostcode = [new PostcodesService({
        _id: '525a8422f6d0f87f0e407a44',
        postcode: '1234'
      })];


      // Initialize the Deliver controller.
      DeliverController = $controller('DeliverController as vm', {
        $scope: $scope
      });
    }));

    it('Should do some controller test', inject(function () {
      // The test logic
      // ...
    }));

    it('should readPostcode', function () {
      var mockPostcodeList;

      beforeEach(function () {
        mockPostcodeList = [mockPostcode, mockPostcode];
      });

      // Test expected GET request
      $httpBackend.expectGET('api/postcodes').respond(mockPostcodeList);

      $scope.vm.readPostcode();
      $httpBackend.flush();
      //expect($scope.vm.postcode.length).toEqual(2);

    });

    it('should be signup', function () {



      // Test expected GET request
      var mockupuesr = { roles : 'deliver' };
      $httpBackend.when('POST', '/api/auth/signup').respond(200, mockupuesr);

      $scope.vm.signup(true);
      $httpBackend.flush();

      // $scope.authentication.user = response;
      expect($scope.vm.user.roles).toBe('deliver');

    });


  });



} ());
