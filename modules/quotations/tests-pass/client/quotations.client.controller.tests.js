(function () {
  'use strict';

  describe('Quotations Controller Tests', function () {
    // Initialize global variables
    var QuotationsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      QuotationsService,
      CompaniesService,
      ProductsService,
      mockQuotation,
      mockClient,
      mockProduct,
      arrayProduct;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _QuotationsService_, _CompaniesService_, _ProductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      QuotationsService = _QuotationsService_;
      CompaniesService = _CompaniesService_;
      ProductsService = _ProductsService_;
      // create mock Quotation
      mockQuotation = new QuotationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Quotation Name'
      });

      mockClient = new CompaniesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Company Name',
        address: 'Company Address',
        taxid: 'Company TaxId',
        creditday: 30
      });

      mockProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Product Name',
        category: 'R',
        saleprice: 100,
        isincludevat: false,
        priceexcludevat: 100,
        priceincludevat: 107
      });

      arrayProduct = [{
        product: mockProduct,
        qty: 1
      }, {
        product: mockProduct,
        qty: 1,
        unitprice: 100,
        amount: 100,
        vatamount: 7,
        whtamount: 5,
        totalamount: 102
      }];

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Quotations controller.
      QuotationsController = $controller('QuotationsController as vm', {
        $scope: $scope,
        quotationResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.setData() as set', function () {

      beforeEach(function () {
        $scope.vm.quotation.docdate = new Date();
      });

      it('should set Data', inject(function () {
        $scope.vm.setData();

        // Test form inputs are reset
        expect($scope.vm.quotation.docdate).toEqual(new Date($scope.vm.quotation.docdate) || new Date());
        expect($scope.vm.quotation.items.length).toEqual(1);

      }));
    });

    describe('vm.readClient() as read', function () {
      var mockClientList;

      beforeEach(function () {
        mockClientList = [mockClient, mockClient, mockClient];
      });

      it('should send a GET request and return all Clients', inject(function (CompaniesService) {
        // Set POST response
        $httpBackend.expectGET('api/companies').respond(mockClientList);

        $scope.vm.readClient();

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.client.length).toEqual(3);
        expect($scope.vm.client[0]).toEqual(mockClient);
        expect($scope.vm.client[1]).toEqual(mockClient);
        expect($scope.vm.client[2]).toEqual(mockClient);

      }));
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

    describe('vm.selectCustomer()', function () {

      beforeEach(function () {
        $scope.vm.quotation.client = mockClient;
      });

      it('should vm.quotation.creditday', function () {
        $scope.vm.selectCustomer();
        expect($scope.vm.quotation.creditday).toEqual(mockClient.creditday);
        expect($scope.vm.quotation.drilldate).toEqual($scope.vm.quotation.drilldate || new Date());
      });
    });

    describe('vm.creditdayChanged()', function () {

      beforeEach(function () {
        mockClient.creditday = 10;
        $scope.vm.quotation.client = mockClient;
      });

      it('should vm.quotation.drilldate', function () {
        $scope.vm.creditdayChanged();
        expect($scope.vm.quotation.drilldate).toEqual($scope.vm.quotation.drilldate || new Date());
      });
    });

    describe('vm.calculate', function () {

      beforeEach(function () {
        $scope.vm.quotation.items = arrayProduct;
      });

      it('should vm.quotation.items', function () {
        $scope.vm.calculate($scope.vm.quotation.items[0]);
        // expect($scope.vm.quotation.items[0].unitprice).toEqual(mockProduct.priceexcludevat);
        expect($scope.vm.quotation.items[0].qty).toEqual($scope.vm.quotation.items[0].qty);
        expect($scope.vm.quotation.items[0].amount).toEqual($scope.vm.quotation.items[0].unitprice * $scope.vm.quotation.items[0].qty);
        expect($scope.vm.quotation.items[0].vatamount).toEqual($scope.vm.quotation.items[0].amount * 0.07);
        if (mockProduct.category === 'S') {
          expect($scope.vm.quotation.items[0].whtamount).toEqual($scope.vm.quotation.items[0].amount * 0.03);
        } else if (mockProduct.category === 'R') {
          expect($scope.vm.quotation.items[0].whtamount).toEqual($scope.vm.quotation.items[0].amount * 0.05);
        }
        expect($scope.vm.quotation.items[0].totalamount).toEqual(($scope.vm.quotation.items[0].amount + $scope.vm.quotation.items[0].vatamount) - $scope.vm.quotation.items[0].whtamount);
        expect($scope.vm.quotation.items[0]).toEqual($scope.vm.quotation.items[0]);
        expect($scope.vm.quotation.amount).toEqual($scope.vm.quotation.items[0].unitprice * $scope.vm.quotation.items[0].qty);
        expect($scope.vm.quotation.vatamount).toEqual($scope.vm.quotation.items[0].vatamount);
        expect($scope.vm.quotation.whtamount).toEqual($scope.vm.quotation.items[0].whtamount);
        expect($scope.vm.quotation.totalamount).toEqual($scope.vm.quotation.items[0].totalamount);
      });
    });

    describe('vm.changeUnitPrice(item) on-change', function () {

      beforeEach(function () {
        $scope.vm.quotation.items = arrayProduct;
      });

      it('should vm.changeUnitPrice(item) set item.unitprice', function () {
        $scope.vm.changeUnitPrice($scope.vm.quotation.items[0]);
        expect($scope.vm.quotation.items[0].unitprice).toEqual($scope.vm.quotation.items[0].product.priceexcludevat);
      });
    });

    describe('vm.removeProduct()', function () {

      beforeEach(function () {
        $scope.vm.quotation.items = arrayProduct;
        $scope.vm.index = 0;
      });

      it('should vm.removeProduct()', function () {
        $scope.vm.removeProduct($scope.vm.index);
        $scope.vm.quotation.items.splice($scope.vm.index, 1);
        expect($scope.vm.quotation.items.length).toEqual(0);
      });
    });

    describe('vm.save() as create', function () {
      var sampleQuotationPostData;

      beforeEach(function () {
        // Create a sample Quotation object
        sampleQuotationPostData = new QuotationsService({
          name: 'Quotation Name'
        });

        $scope.vm.quotation = sampleQuotationPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (QuotationsService) {
        // Set POST response
        $httpBackend.expectPOST('api/quotations', sampleQuotationPostData).respond(mockQuotation);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Quotation was created
        expect($state.go).toHaveBeenCalledWith('quotations.view', {
          quotationId: mockQuotation._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/quotations', sampleQuotationPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Quotation in $scope
        $scope.vm.quotation = mockQuotation;
      });

      it('should update a valid Quotation', inject(function (QuotationsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/quotations\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('quotations.view', {
          quotationId: mockQuotation._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (QuotationsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/quotations\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Quotations
        $scope.vm.quotation = mockQuotation;
      });

      it('should delete the Quotation and redirect to Quotations', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/quotations\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('quotations.list');
      });

      it('should should not delete the Quotation and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });

  });
} ());
