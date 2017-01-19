(function () {
  'use strict';

  describe('Managebanks Route Tests', function () {
    // Initialize global variables
    var $scope,
      ManagebanksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ManagebanksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ManagebanksService = _ManagebanksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('managebanks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/managebanks');
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
          ManagebanksController,
          mockManagebank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('managebanks.view');
          $templateCache.put('modules/managebanks/client/views/view-managebank.client.view.html', '');

          // create mock Managebank
          mockManagebank = new ManagebanksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Managebank Name'
          });

          // Initialize Controller
          ManagebanksController = $controller('ManagebanksController as vm', {
            $scope: $scope,
            managebankResolve: mockManagebank
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:managebankId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.managebankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            managebankId: 1
          })).toEqual('/managebanks/1');
        }));

        it('should attach an Managebank to the controller scope', function () {
          expect($scope.vm.managebank._id).toBe(mockManagebank._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/managebanks/client/views/view-managebank.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ManagebanksController,
          mockManagebank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('managebanks.create');
          $templateCache.put('modules/managebanks/client/views/form-managebank.client.view.html', '');

          // create mock Managebank
          mockManagebank = new ManagebanksService();

          // Initialize Controller
          ManagebanksController = $controller('ManagebanksController as vm', {
            $scope: $scope,
            managebankResolve: mockManagebank
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.managebankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/managebanks/create');
        }));

        it('should attach an Managebank to the controller scope', function () {
          expect($scope.vm.managebank._id).toBe(mockManagebank._id);
          expect($scope.vm.managebank._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/managebanks/client/views/form-managebank.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ManagebanksController,
          mockManagebank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('managebanks.edit');
          $templateCache.put('modules/managebanks/client/views/form-managebank.client.view.html', '');

          // create mock Managebank
          mockManagebank = new ManagebanksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Managebank Name'
          });

          // Initialize Controller
          ManagebanksController = $controller('ManagebanksController as vm', {
            $scope: $scope,
            managebankResolve: mockManagebank
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:managebankId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.managebankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            managebankId: 1
          })).toEqual('/managebanks/1/edit');
        }));

        it('should attach an Managebank to the controller scope', function () {
          expect($scope.vm.managebank._id).toBe(mockManagebank._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/managebanks/client/views/form-managebank.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
