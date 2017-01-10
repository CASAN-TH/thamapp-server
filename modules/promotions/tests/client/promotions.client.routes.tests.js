(function () {
  'use strict';

  describe('Promotions Route Tests', function () {
    // Initialize global variables
    var $scope,
      PromotionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PromotionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PromotionsService = _PromotionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('promotions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/promotions');
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
          PromotionsController,
          mockPromotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('promotions.view');
          $templateCache.put('modules/promotions/client/views/view-promotion.client.view.html', '');

          // create mock Promotion
          mockPromotion = new PromotionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Promotion Name'
          });

          // Initialize Controller
          PromotionsController = $controller('PromotionsController as vm', {
            $scope: $scope,
            promotionResolve: mockPromotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:promotionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.promotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            promotionId: 1
          })).toEqual('/promotions/1');
        }));

        it('should attach an Promotion to the controller scope', function () {
          expect($scope.vm.promotion._id).toBe(mockPromotion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/promotions/client/views/view-promotion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PromotionsController,
          mockPromotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('promotions.create');
          $templateCache.put('modules/promotions/client/views/form-promotion.client.view.html', '');

          // create mock Promotion
          mockPromotion = new PromotionsService();

          // Initialize Controller
          PromotionsController = $controller('PromotionsController as vm', {
            $scope: $scope,
            promotionResolve: mockPromotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.promotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/promotions/create');
        }));

        it('should attach an Promotion to the controller scope', function () {
          expect($scope.vm.promotion._id).toBe(mockPromotion._id);
          expect($scope.vm.promotion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/promotions/client/views/form-promotion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PromotionsController,
          mockPromotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('promotions.edit');
          $templateCache.put('modules/promotions/client/views/form-promotion.client.view.html', '');

          // create mock Promotion
          mockPromotion = new PromotionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Promotion Name'
          });

          // Initialize Controller
          PromotionsController = $controller('PromotionsController as vm', {
            $scope: $scope,
            promotionResolve: mockPromotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:promotionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.promotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            promotionId: 1
          })).toEqual('/promotions/1/edit');
        }));

        it('should attach an Promotion to the controller scope', function () {
          expect($scope.vm.promotion._id).toBe(mockPromotion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/promotions/client/views/form-promotion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
