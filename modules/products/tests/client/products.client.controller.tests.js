(function () {
  'use strict';

  describe('Products Controller Tests', function () {
    // Initialize global variables
    var ProductsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ProductsService,
      mockProduct,
      PromotionsService,
      mockPromotion;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ProductsService_, _PromotionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ProductsService = _ProductsService_;
      PromotionsService = _PromotionsService_;

      // create mock Product
      mockProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Product Name'
      });

      mockPromotion = new PromotionsService({
        _id: '525a8422f6d0f87f0e407a55',
        description: 'description'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Products controller.
      ProductsController = $controller('ProductsController as vm', {
        $scope: $scope,
        productResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleProductPostData;

      beforeEach(function () {
        // Create a sample Product object
        sampleProductPostData = new ProductsService({
          name: 'Product Name'
        });

        $scope.vm.product = sampleProductPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ProductsService) {
        // Set POST response
        $httpBackend.expectPOST('api/products', sampleProductPostData).respond(mockProduct);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Product was created
        expect($state.go).toHaveBeenCalledWith('products.view', {
          productId: mockProduct._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/products', sampleProductPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Product in $scope
        $scope.vm.product = mockProduct;
      });

      it('should update a valid Product', inject(function (ProductsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('products.view', {
          productId: mockProduct._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ProductsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Products
        $scope.vm.product = mockProduct;
      });

      it('should delete the Product and redirect to Products', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/products\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('products.list');
      });

      it('should should not delete the Product and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
    describe('vm.readProduct() as read', function () {
      var mockProductList;

      beforeEach(function () {
        mockProductList = [mockProduct, mockProduct, mockProduct];
      });

      it('should send a GET request and return all Product', inject(function (ProductsService) {
        // Set POST response
        $httpBackend.expectGET('api/products').respond(mockProductList);

        $scope.vm.readProduct();

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.products.length).toEqual(3);
        expect($scope.vm.products[0]).toEqual(mockProduct);
        expect($scope.vm.products[1]).toEqual(mockProduct);
        expect($scope.vm.products[2]).toEqual(mockProduct);

      }));
    });

    describe('vm.readPromotion()', function () {
      var mockPromotionList;
      beforeEach(function () {
        mockPromotionList = [mockPromotion, mockPromotion, mockPromotion];
      });

      it('should send a GET request and return all Promotion', inject(function (PromotionsService) {
        // Set POST response
        $httpBackend.expectGET('api/promotions').respond(mockPromotionList);

        $scope.vm.readPromotion();

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.promotion[0].description).toEqual(mockPromotion.description);

      }));
    });
    // describe('vm.moreCart()', function () {
    //   var p1;

    //   beforeEach(function () {
    //     p1 = mockProduct;
    //   });

    //   it('change data', inject(function () {
    //     $scope.moreCart(p1);
    //     expect(p1).toEqual(mockProduct);

    //   }));
    // });
  });
} ());
