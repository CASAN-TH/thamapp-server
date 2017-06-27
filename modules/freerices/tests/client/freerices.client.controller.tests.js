(function () {
  'use strict';

  describe('Freerices Controller Tests', function () {
    // Initialize global variables
    var FreericesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      FreericesService,
      mockFreerice;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _FreericesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      FreericesService = _FreericesService_;

      // create mock Freerice
      mockFreerice = new FreericesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Freerice Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Freerices controller.
      FreericesController = $controller('FreericesController as vm', {
        $scope: $scope,
        freericeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleFreericePostData;

      beforeEach(function () {
        // Create a sample Freerice object
        sampleFreericePostData = new FreericesService({
          name: 'Freerice Name'
        });

        $scope.vm.freerice = sampleFreericePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (FreericesService) {
        // Set POST response
        $httpBackend.expectPOST('api/freerices', sampleFreericePostData).respond(mockFreerice);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Freerice was created
        expect($state.go).toHaveBeenCalledWith('freerices.view', {
          freericeId: mockFreerice._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/freerices', sampleFreericePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Freerice in $scope
        $scope.vm.freerice = mockFreerice;
      });

      it('should update a valid Freerice', inject(function (FreericesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/freerices\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('freerices.view', {
          freericeId: mockFreerice._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (FreericesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/freerices\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Freerices
        $scope.vm.freerice = mockFreerice;
      });

      it('should delete the Freerice and redirect to Freerices', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/freerices\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('freerices.list');
      });

      it('should should not delete the Freerice and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
