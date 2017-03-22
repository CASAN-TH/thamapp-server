(function () {
  'use strict';

  describe('Adjusts Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdjustsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdjustsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdjustsService = _AdjustsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adjusts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adjusts');
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
          AdjustsController,
          mockAdjust;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adjusts.view');
          $templateCache.put('modules/adjusts/client/views/view-adjust.client.view.html', '');

          // create mock Adjust
          mockAdjust = new AdjustsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adjust Name'
          });

          // Initialize Controller
          AdjustsController = $controller('AdjustsController as vm', {
            $scope: $scope,
            adjustResolve: mockAdjust
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adjustId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adjustResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adjustId: 1
          })).toEqual('/adjusts/1');
        }));

        it('should attach an Adjust to the controller scope', function () {
          expect($scope.vm.adjust._id).toBe(mockAdjust._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adjusts/client/views/view-adjust.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdjustsController,
          mockAdjust;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adjusts.create');
          $templateCache.put('modules/adjusts/client/views/form-adjust.client.view.html', '');

          // create mock Adjust
          mockAdjust = new AdjustsService();

          // Initialize Controller
          AdjustsController = $controller('AdjustsController as vm', {
            $scope: $scope,
            adjustResolve: mockAdjust
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adjustResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adjusts/create');
        }));

        it('should attach an Adjust to the controller scope', function () {
          expect($scope.vm.adjust._id).toBe(mockAdjust._id);
          expect($scope.vm.adjust._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adjusts/client/views/form-adjust.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdjustsController,
          mockAdjust;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adjusts.edit');
          $templateCache.put('modules/adjusts/client/views/form-adjust.client.view.html', '');

          // create mock Adjust
          mockAdjust = new AdjustsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adjust Name'
          });

          // Initialize Controller
          AdjustsController = $controller('AdjustsController as vm', {
            $scope: $scope,
            adjustResolve: mockAdjust
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adjustId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adjustResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adjustId: 1
          })).toEqual('/adjusts/1/edit');
        }));

        it('should attach an Adjust to the controller scope', function () {
          expect($scope.vm.adjust._id).toBe(mockAdjust._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adjusts/client/views/form-adjust.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
