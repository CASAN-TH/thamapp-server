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

    describe('vm.cart.add(product) get deliveryCost', function () {
      var product = {
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Product Name',
        deliveryratetype: 0
      };
      var product1 = {
        _id: '525a8422f6d0f87f0e407a34',
        name: 'Product Name',
        deliveryratetype: 1,
        valuetype1: 50
      };
      var product2 = {
        _id: '525a8422f6d0f87f0e407a35',
        name: 'Product Name',
        deliveryratetype: 2,
        rangtype2: [{
          min: 1,
          max: 5,
          value: 50
        },
          {
            min: 6,
            max: 10,
            value: 100
          },
          {
            min: 11,
            max: 999999999,
            value: 150
          }]
      };
      it('vm.cart.add(product) case 0', function () {
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(1);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(0);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(0);
      });

      it('vm.cart.add(product) case 1', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 1;
        product.valuetype1 = 50;
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(1);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(1);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(50);
      });

      it('vm.cart.add(product) case 1 have 2 unit', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 1;
        product.valuetype1 = 50;
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(2);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(1);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(100);
      });

      it('vm.cart.add(product) case 2 have 1 unit', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 2;
        product.rangtype2 = [{
          min: 1,
          max: 5,
          value: 50
        },
          {
            min: 6,
            max: 10,
            value: 100
          },
          {
            min: 11,
            max: 999999999,
            value: 150
          }];
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(1);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(2);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(50);
      });

      it('vm.cart.add(product) case 2 have 2 unit', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 2;
        product.rangtype2 = [{
          min: 1,
          max: 5,
          value: 50
        },
          {
            min: 6,
            max: 10,
            value: 100
          },
          {
            min: 11,
            max: 999999999,
            value: 150
          }];
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(2);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(2);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(50);
      });

      it('vm.cart.add(product) case 2 have 6 unit', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 2;
        product.rangtype2 = [{
          min: 1,
          max: 5,
          value: 50
        },
          {
            min: 6,
            max: 10,
            value: 100
          },
          {
            min: 11,
            max: 999999999,
            value: 150
          }];
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(6);
        expect($scope.vm.cart.items[0].product.deliveryratetype).toEqual(2);
        expect($scope.vm.cart.items[0].deliverycost).toEqual(100);
      });

      it('vm.cart.add(product) case getTotalDeliveryCost()', function () {
        $scope.vm.cart.clear();
        product.deliveryratetype = 0;
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product1);
        $scope.vm.cart.add(product1);
        $scope.vm.cart.remove(product1);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.add(product2);
        $scope.vm.cart.remove(product2);
        expect($scope.vm.cart.items.length).toEqual(3);
        expect($scope.vm.cart.items[0].qty).toEqual(1);
        expect($scope.vm.cart.items[1].qty).toEqual(1);
        expect($scope.vm.cart.items[2].qty).toEqual(5);
        expect($scope.vm.cart.getTotalDeliveryCost()).toEqual(100);
      });

    });

    describe('vm.cart.add(product) get discount', function () {
      var product = {
        _id: '5885e9bcea48c81000919ff8',
        name: 'Product Name',
        promotions: [{ '_id': '5885ea25ea48c81000919ff9', 'user': '58631cf0043a1110007dcfd0', 'product': '5885e9bcea48c81000919ff8', 'description': 'ลดค่าจัดส่งให้ 50 บาท ทุกๆ 3 ถุง เช่น 3 ถุงจะเหลือเพียง 250 บาท หรือ 6 ถุงจะเหลือเพียง 500 บาท', 'condition': 3, 'expdate': '2017-12-31T17:00:00.000Z', '__v': 0, 'created': '2017-01-23T11:33:57.694Z', 'discount': { 'percen': 0, 'fixBath': 50 }, '$$hashKey': 'object:102' }]
      };
      var product1 = {
        _id: '5885e9bcea48c81000919ff7',
        name: 'Product Name',
        promotions: [{ '_id': '5885ea25ea48c81000919ff9', 'user': '58631cf0043a1110007dcfd0', 'product': '5885e9bcea48c81000919ff7', 'description': 'ลดค่าจัดส่งให้ 50 บาท ทุกๆ 3 ถุง เช่น 3 ถุงจะเหลือเพียง 250 บาท หรือ 6 ถุงจะเหลือเพียง 500 บาท', 'condition': 3, 'expdate': '2017-12-31T17:00:00.000Z', '__v': 0, 'created': '2017-01-23T11:33:57.694Z', 'discount': { 'percen': 0, 'fixBath': 20 }, '$$hashKey': 'object:102' }]
      };
      it('get discount case FixBath have 1 unit', function () {
        $scope.vm.cart.clear();
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(1);
        expect($scope.vm.cart.items[0].discountamount).toEqual(0);
      });

      it('get discount case FixBath have 4 unit', function () {
        $scope.vm.cart.clear();
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        expect($scope.vm.cart.items.length).toEqual(1);
        expect($scope.vm.cart.items[0].qty).toEqual(4);
        expect($scope.vm.cart.items[0].discountamount).toEqual(50);
      });

      it('vm.cart.add(product) case getTotalDiscount()', function () {
        $scope.vm.cart.clear();
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product);
        $scope.vm.cart.add(product1);
        $scope.vm.cart.add(product1);
        $scope.vm.cart.add(product1);
        $scope.vm.cart.remove(product1);
        expect($scope.vm.cart.items.length).toEqual(2);
        expect($scope.vm.cart.items[0].qty).toEqual(3);
        expect($scope.vm.cart.items[1].qty).toEqual(2);
        expect($scope.vm.cart.getTotalDiscount()).toEqual(50);
      });

    });


  });
} ());
