(function () {
  'use strict';

  describe('Accuralreceipts Route Tests', function () {
    // Initialize global variables
    var $scope,
      AccuralreceiptsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AccuralreceiptsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AccuralreceiptsService = _AccuralreceiptsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('accuralreceipts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/accuralreceipts');
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
          AccuralreceiptsController,
          mockAccuralreceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('accuralreceipts.view');
          $templateCache.put('modules/accuralreceipts/client/views/view-accuralreceipt.client.view.html', '');

          // create mock Accuralreceipt
          mockAccuralreceipt = new AccuralreceiptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accuralreceipt Name'
          });

          // Initialize Controller
          AccuralreceiptsController = $controller('AccuralreceiptsController as vm', {
            $scope: $scope,
            accuralreceiptResolve: mockAccuralreceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:accuralreceiptId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.accuralreceiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            accuralreceiptId: 1
          })).toEqual('/accuralreceipts/1');
        }));

        it('should attach an Accuralreceipt to the controller scope', function () {
          expect($scope.vm.accuralreceipt._id).toBe(mockAccuralreceipt._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/accuralreceipts/client/views/view-accuralreceipt.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AccuralreceiptsController,
          mockAccuralreceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('accuralreceipts.create');
          $templateCache.put('modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html', '');

          // create mock Accuralreceipt
          mockAccuralreceipt = new AccuralreceiptsService();

          // Initialize Controller
          AccuralreceiptsController = $controller('AccuralreceiptsController as vm', {
            $scope: $scope,
            accuralreceiptResolve: mockAccuralreceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.accuralreceiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/accuralreceipts/create');
        }));

        it('should attach an Accuralreceipt to the controller scope', function () {
          expect($scope.vm.accuralreceipt._id).toBe(mockAccuralreceipt._id);
          expect($scope.vm.accuralreceipt._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AccuralreceiptsController,
          mockAccuralreceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('accuralreceipts.edit');
          $templateCache.put('modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html', '');

          // create mock Accuralreceipt
          mockAccuralreceipt = new AccuralreceiptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accuralreceipt Name'
          });

          // Initialize Controller
          AccuralreceiptsController = $controller('AccuralreceiptsController as vm', {
            $scope: $scope,
            accuralreceiptResolve: mockAccuralreceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:accuralreceiptId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.accuralreceiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            accuralreceiptId: 1
          })).toEqual('/accuralreceipts/1/edit');
        }));

        it('should attach an Accuralreceipt to the controller scope', function () {
          expect($scope.vm.accuralreceipt._id).toBe(mockAccuralreceipt._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
