(function () {
  'use strict';

  describe('Receivings Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReceivingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReceivingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReceivingsService = _ReceivingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('receivings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/receivings');
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
          ReceivingsController,
          mockReceiving;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('receivings.view');
          $templateCache.put('modules/receivings/client/views/view-receiving.client.view.html', '');

          // create mock Receiving
          mockReceiving = new ReceivingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Receiving Name'
          });

          // Initialize Controller
          ReceivingsController = $controller('ReceivingsController as vm', {
            $scope: $scope,
            receivingResolve: mockReceiving
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:receivingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.receivingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            receivingId: 1
          })).toEqual('/receivings/1');
        }));

        it('should attach an Receiving to the controller scope', function () {
          expect($scope.vm.receiving._id).toBe(mockReceiving._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/receivings/client/views/view-receiving.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReceivingsController,
          mockReceiving;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('receivings.create');
          $templateCache.put('modules/receivings/client/views/form-receiving.client.view.html', '');

          // create mock Receiving
          mockReceiving = new ReceivingsService();

          // Initialize Controller
          ReceivingsController = $controller('ReceivingsController as vm', {
            $scope: $scope,
            receivingResolve: mockReceiving
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.receivingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/receivings/create');
        }));

        it('should attach an Receiving to the controller scope', function () {
          expect($scope.vm.receiving._id).toBe(mockReceiving._id);
          expect($scope.vm.receiving._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/receivings/client/views/form-receiving.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReceivingsController,
          mockReceiving;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('receivings.edit');
          $templateCache.put('modules/receivings/client/views/form-receiving.client.view.html', '');

          // create mock Receiving
          mockReceiving = new ReceivingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Receiving Name'
          });

          // Initialize Controller
          ReceivingsController = $controller('ReceivingsController as vm', {
            $scope: $scope,
            receivingResolve: mockReceiving
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:receivingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.receivingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            receivingId: 1
          })).toEqual('/receivings/1/edit');
        }));

        it('should attach an Receiving to the controller scope', function () {
          expect($scope.vm.receiving._id).toBe(mockReceiving._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/receivings/client/views/form-receiving.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
