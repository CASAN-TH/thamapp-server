'use strict';

(function () {
  // Detail Controller Spec
  describe('Detail Controller Tests', function () {
    // Initialize global variables
    var DetailController,
      $scope,
      $httpBackend,
      $state,
      $window,
      Authentication,
      ProductsService,
      mockCart,
      mockOtherProduct,
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
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$state_, _Authentication_, _ProductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      ProductsService = _ProductsService_;

      mockProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Product Name',
        price: 100
      });
      mockOtherProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a30',
        name: 'Product Name',
        price: 200
      });


      // Initialize the Detail controller.
      DetailController = $controller('DetailController as vm', {
        $scope: $scope,
        productResolve: mockProduct
      });
    }));

    describe('Instantiate', function () {

      it('should send a GET request and return  Product detail', inject(function () {

        expect($scope.vm.product).toEqual(mockProduct);


      }));

     

    });

    describe('addCart', function () {

     

      it('should add product to cart', inject(function () {

        $scope.vm.cart.add(mockProduct);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].product).toEqual(mockProduct);
        expect($scope.vm.cart.getTotalCount()).toEqual(1);
        expect($scope.vm.cart.getTotalPrice()).toEqual(100);

      }));


      it('should add same product to cart', inject(function () {

        $scope.vm.cart.add(mockProduct);
        //$scope.vm.cart.add(mockProduct);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(2);
        expect($scope.vm.cart.getTotalCount()).toEqual(2);
        expect($scope.vm.cart.getTotalPrice()).toEqual(200);


      }));

      it('should add other product to cart', inject(function () {

        $scope.vm.cart.add(mockOtherProduct);
        //$scope.vm.cart.add(mockProduct);
        expect($scope.vm.cart.items.length).toEqual(2);
        expect($scope.vm.cart.items[1].product).toEqual(mockOtherProduct);
        expect($scope.vm.cart.getTotalCount()).toEqual(3);
        expect($scope.vm.cart.getTotalPrice()).toEqual(400);

      }));

    });

    describe('checkOut', function () {

     

      it('should checkOut cart', inject(function () {

        $scope.vm.checkOut(mockProduct);
        expect($scope.vm.cart.items.length).toEqual(2);
        expect($scope.vm.cart.items[0].qty).toEqual(3);




      }));

        afterEach(inject(function (_ShopCartService_){
          var shopCartService = _ShopCartService_;
          shopCartService.cart.clear();
        }));
      
    });
  });
} ());
