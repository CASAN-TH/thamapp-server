(function () {
  'use strict';

  describe('Returnorders Controller Tests', function () {
    // Initialize global variables
    var ReturnordersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReturnordersService,
      mockReturnorder;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReturnordersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReturnordersService = _ReturnordersService_;

      // create mock Returnorder
      mockReturnorder = new ReturnordersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Returnorder Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Returnorders controller.
      ReturnordersController = $controller('ReturnordersController as vm', {
        $scope: $scope,
        returnorderResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleReturnorderPostData;

      beforeEach(function () {
        // Create a sample Returnorder object
        sampleReturnorderPostData = new ReturnordersService({
          name: 'Returnorder Name'
        });

        $scope.vm.returnorder = sampleReturnorderPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ReturnordersService) {
        // Set POST response
        $httpBackend.expectPOST('api/returnorders', sampleReturnorderPostData).respond(sampleReturnorderPostData);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Returnorder was created
        if ($scope.vm.authentication.user._id === sampleReturnorderPostData.namedeliver) {
          expect($state.go).toHaveBeenCalledWith('returndeliver');
        } else {
          // Test URL redirection after the Order was created
          expect($state.go).toHaveBeenCalledWith('returnorders.list');
        }
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/returnorders', sampleReturnorderPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Returnorder in $scope
        $scope.vm.returnorder = mockReturnorder;
      });

      it('should update a valid Returnorder', inject(function (ReturnordersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/returnorders\/([0-9a-fA-F]{24})$/).respond(mockReturnorder);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        if ($scope.vm.authentication.user._id === mockReturnorder.namedeliver) {
          expect($state.go).toHaveBeenCalledWith('returndeliver');
        } else {
          // Test URL redirection after the Order was created
          expect($state.go).toHaveBeenCalledWith('returnorders.list');
        }
        //
      }));

      it('should set $scope.vm.error if error', inject(function (ReturnordersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/returnorders\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Returnorders
        $scope.vm.returnorder = mockReturnorder;
      });

      it('should delete the Returnorder and redirect to Returnorders', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/returnorders\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('returnorders.list');
      });

      it('should should not delete the Returnorder and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
