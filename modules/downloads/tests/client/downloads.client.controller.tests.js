(function () {
  'use strict';

  describe('Downloads Controller Tests', function () {
    // Initialize global variables
    var DownloadsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      DownloadsService,
      mockDownload;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _DownloadsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      DownloadsService = _DownloadsService_;

      // create mock Download
      mockDownload = new DownloadsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Download Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Downloads controller.
      DownloadsController = $controller('DownloadsController as vm', {
        $scope: $scope,
        downloadResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleDownloadPostData;

      beforeEach(function () {
        // Create a sample Download object
        sampleDownloadPostData = new DownloadsService({
          name: 'Download Name'
        });

        $scope.vm.download = sampleDownloadPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (DownloadsService) {
        // Set POST response
        $httpBackend.expectPOST('api/downloads', sampleDownloadPostData).respond(mockDownload);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Download was created
        expect($state.go).toHaveBeenCalledWith('downloads.view', {
          downloadId: mockDownload._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/downloads', sampleDownloadPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Download in $scope
        $scope.vm.download = mockDownload;
      });

      it('should update a valid Download', inject(function (DownloadsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/downloads\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('downloads.view', {
          downloadId: mockDownload._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (DownloadsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/downloads\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Downloads
        $scope.vm.download = mockDownload;
      });

      it('should delete the Download and redirect to Downloads', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/downloads\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('downloads.list');
      });

      it('should should not delete the Download and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
