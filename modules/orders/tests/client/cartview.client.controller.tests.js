'use strict';

(function () {
  // Cartview Controller Spec
  describe('Cartview Controller Tests', function () {
    // Initialize global variables
    var CartviewController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      PromotionsService,
      mockPromotion,
      ProductsService,
      mockProduct;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _PromotionsService_, _ProductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      PromotionsService = _PromotionsService_;
      ProductsService = _ProductsService_;
      mockProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a77'
      });
      mockPromotion = new PromotionsService({
        _id: '525a8422f6d0f87f0e407a66',
        products: [{
          product: mockProduct
        }],
        condition : 1,
        description: 'test',
        discount: {
          fixBath: 0,
          percen: 0
        },
        freeitem: {
          qty: 2
        }
      });

      // Initialize the Cartview controller.
      CartviewController = $controller('CartviewController as vm', {
        $scope: $scope
      });
    }));

    describe('vm.readPromotion() as read', function () {
      var mockPromotionList;

      beforeEach(function () {
        mockPromotionList = [mockPromotion, mockPromotion, mockPromotion];
      });

      it('should send a GET all Promotions', inject(function (PromotionsService) {
        // Set POST response
        $httpBackend.expectGET('api/promotions').respond(mockPromotionList);

        $scope.vm.Promotion();

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.promotions.length).toEqual(3);

      }));

    });


  });
} ());
