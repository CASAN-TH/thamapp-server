(function () {
  'use strict';

  describe('Marketplans Route Tests', function () {
    // Initialize global variables
    var $scope,
      MarketplansService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MarketplansService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MarketplansService = _MarketplansService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('marketplans');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/marketplans');
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
          MarketplansController,
          mockMarketplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('marketplans.view');
          $templateCache.put('modules/marketplans/client/views/view-marketplan.client.view.html', '');

          // create mock Marketplan
          mockMarketplan = new MarketplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Marketplan Name'
          });

          // Initialize Controller
          MarketplansController = $controller('MarketplansController as vm', {
            $scope: $scope,
            marketplanResolve: mockMarketplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:marketplanId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.marketplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            marketplanId: 1
          })).toEqual('/marketplans/1');
        }));

        it('should attach an Marketplan to the controller scope', function () {
          expect($scope.vm.marketplan._id).toBe(mockMarketplan._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/marketplans/client/views/view-marketplan.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MarketplansController,
          mockMarketplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('marketplans.create');
          $templateCache.put('modules/marketplans/client/views/form-marketplan.client.view.html', '');

          // create mock Marketplan
          mockMarketplan = new MarketplansService();

          // Initialize Controller
          MarketplansController = $controller('MarketplansController as vm', {
            $scope: $scope,
            marketplanResolve: mockMarketplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.marketplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/marketplans/create');
        }));

        it('should attach an Marketplan to the controller scope', function () {
          expect($scope.vm.marketplan._id).toBe(mockMarketplan._id);
          expect($scope.vm.marketplan._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/marketplans/client/views/form-marketplan.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MarketplansController,
          mockMarketplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('marketplans.edit');
          $templateCache.put('modules/marketplans/client/views/form-marketplan.client.view.html', '');

          // create mock Marketplan
          mockMarketplan = new MarketplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Marketplan Name'
          });

          // Initialize Controller
          MarketplansController = $controller('MarketplansController as vm', {
            $scope: $scope,
            marketplanResolve: mockMarketplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:marketplanId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.marketplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            marketplanId: 1
          })).toEqual('/marketplans/1/edit');
        }));

        it('should attach an Marketplan to the controller scope', function () {
          expect($scope.vm.marketplan._id).toBe(mockMarketplan._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/marketplans/client/views/form-marketplan.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
