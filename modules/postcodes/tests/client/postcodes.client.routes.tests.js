(function () {
  'use strict';

  describe('Postcodes Route Tests', function () {
    // Initialize global variables
    var $scope,
      PostcodesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PostcodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PostcodesService = _PostcodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('postcodes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/postcodes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PostcodesController,
          mockPostcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('postcodes.view');
          $templateCache.put('modules/postcodes/client/views/view-postcode.client.view.html', '');

          // create mock Postcode
          mockPostcode = new PostcodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Postcode Name'
          });

          // Initialize Controller
          PostcodesController = $controller('PostcodesController as vm', {
            $scope: $scope,
            postcodeResolve: mockPostcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:postcodeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.postcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            postcodeId: 1
          })).toEqual('/postcodes/1');
        }));

        it('should attach an Postcode to the controller scope', function () {
          expect($scope.vm.postcode._id).toBe(mockPostcode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/postcodes/client/views/view-postcode.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PostcodesController,
          mockPostcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('postcodes.create');
          $templateCache.put('modules/postcodes/client/views/form-postcode.client.view.html', '');

          // create mock Postcode
          mockPostcode = new PostcodesService();

          // Initialize Controller
          PostcodesController = $controller('PostcodesController as vm', {
            $scope: $scope,
            postcodeResolve: mockPostcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.postcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/postcodes/create');
        }));

        it('should attach an Postcode to the controller scope', function () {
          expect($scope.vm.postcode._id).toBe(mockPostcode._id);
          expect($scope.vm.postcode._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/postcodes/client/views/form-postcode.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PostcodesController,
          mockPostcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('postcodes.edit');
          $templateCache.put('modules/postcodes/client/views/form-postcode.client.view.html', '');

          // create mock Postcode
          mockPostcode = new PostcodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Postcode Name'
          });

          // Initialize Controller
          PostcodesController = $controller('PostcodesController as vm', {
            $scope: $scope,
            postcodeResolve: mockPostcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:postcodeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.postcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            postcodeId: 1
          })).toEqual('/postcodes/1/edit');
        }));

        it('should attach an Postcode to the controller scope', function () {
          expect($scope.vm.postcode._id).toBe(mockPostcode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/postcodes/client/views/form-postcode.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
