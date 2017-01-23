'use strict';

(function () {
  // Signinuser Controller Spec
  describe('Signinuser Controller Tests', function () {
    // Initialize global variables
    var SigninuserController,
      $scope,
      $httpBackend,
      $stateParams,
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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Signinuser controller.
      SigninuserController = $controller('SigninuserController', {
        $scope: $scope
      });
    }));

      describe('$scope.signin()', function () {

        it('should login with a correct user and password', function () {
          // Test expected GET request
          $httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

          $scope.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect($scope.authentication.user).toEqual('Fred');
          expect($location.url()).toEqual('/');
        });


        it('should fail to log in with nothing', function () {
          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Missing credentials'
          });

          $scope.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect($scope.error).toEqual('Missing credentials');
        });
      });
  });
} ());
