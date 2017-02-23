(function () {
  'use strict';

  describe('Requestorders Controller Tests', function () {
    // Initialize global variables
    var RequestordersController,
      $scope,
      $httpBackend,
      $state,
      Users,
      Authentication,
      RequestordersService,
      ProductsService,
      mockRequestRequestorder,
      mockProduct,
      mockDeliver,
      mockStatusRequestorder,
      mockCustomer,
      mockHisStatus,
      mockRequestorder;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Users_, _Authentication_, _ProductsService_, _RequestordersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Users = _Users_;
      Authentication = _Authentication_;
      ProductsService = _ProductsService_;
      RequestordersService = _RequestordersService_;

      // create mock Requestorder
      mockRequestRequestorder = new RequestordersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        deliverystatus: 'request'
      });

      mockRequestorder = new RequestordersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Requestorder Name',
        shipping: {
          firstname: 'firstname',
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel',
          email: 'email',
          lastname: 'lastname'
        },
        transport: {
          user: '58941192223c50c40e268405',
          created: '2017-02-15T11:05:29.912Z',
          address: {
            address: 'address',
            postcode: 'postcode',
            province: 'province',
            tel: 'tel',
            subdistrict: 'subdistrict',
            district: 'district',
            email: 'email'
          },
          name: 'บ.Sarawut'
        },
        amount: 30,
        discount: 20,
        namedeliver: {
          displayName: 'deliver2 deliver2'
        },
        user: {
          displayName: 'deliver2 deliver2'
        }
      });

      mockHisStatus = new RequestordersService({
        historystatus: [{
          status: 'pending',
          datestatus: '10/11/2015'
        }]
      });

      mockStatusRequestorder = new RequestordersService({
        _id: '525a8422f6d0f87f0e407a33',
        docno: '20170210',
        docdate: '24/05/2535',
        shipping: {
          tel: '0788654123',
          email: 'toonelicious@gmail.com',
          firstname: 'shipping firstName',
          lastname: 'shipping lastName',
          address: '51/356',
          postcode: '12150',
          subdistrict: 'คลองถนน',
          province: 'ปทุมธานี',
          district: 'สายไหม'
        },
        item: [{
          product: mockProduct
        }],
        amount: 54,
        postcost: 10,
        discount: 10,
        comment: 'comment',
        deliverystatus: 'confirmed'
      });

      mockProduct = new ProductsService({
        _id: '525a8422f6d0f87f0e407a30',
        name: 'Product Name',
        price: 100
      });

      mockDeliver = new Users({
        _id: '585a0a624b1d9cd80e439b3e',
        salt: 'g2K5zNV8Jgx+/AxyZcbiUw==',
        displayName: 'deliver2 deliver2',
        provider: 'local',
        username: 'deliver2',
        __v: 0,
        created: '2016-12-21T04:51:46.142Z',
        roles: [
          'deliver'
        ],
        address: {
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel'
        },
        email: 'email',
        lastName: 'lastName',
        firstName: 'firstName'
      });

      mockCustomer = new Users({
        _id: '585a0a624b1d9cd80e439b3e',
        salt: 'g2K5zNV8Jgx+/AxyZcbiUw==',
        displayName: 'deliver2 deliver2',
        provider: 'local',
        username: 'deliver2',
        __v: 0,
        created: '2016-12-21T04:51:46.142Z',
        roles: [
          'user'
        ],
        address: {
          postcode: 'postcode',
          district: 'district',
          subdistrict: 'subdistrict',
          province: 'province',
          address: 'address',
          tel: 'tel'
        },
        email: 'email',
        lastName: 'lastName',
        firstName: 'firstName'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Requestorders controller.
      RequestordersController = $controller('RequestordersController as vm', {
        $scope: $scope,
        requestorderResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.init() ', function () {
      it('should init', inject(function (ProductsService) {
        $scope.vm.init();
        // expect($scope.vm.requestorder.docdate).toEqual(new Date());
        expect($scope.vm.requestorder.items.length).toEqual(1);
      }));
    });

    describe('vm.addQty() ', function () {
      beforeEach(function () {
        $scope.vm.requestorder = {
          items: [{
            product: {
              price: 200
            },
            qty: 1
          }]
        };
      });
      it('should addQty', inject(function () {
        $scope.vm.addQty($scope.vm.requestorder.items[0]);
        expect($scope.vm.requestorder.items[0].qty).toEqual(2);
      }));
    });

    describe('vm.removeQty() ', function () {
      beforeEach(function () {
        $scope.vm.requestorder = {
          items: [{
            product: {
              price: 200
            },
            qty: 2
          }]
        };
      });
      it('should removeQty', inject(function () {
        $scope.vm.removeQty($scope.vm.requestorder.items[0]);
        expect($scope.vm.requestorder.items[0].qty).toEqual(1);
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

    describe('vm.readDeliverid() as read', function () {

      it('should send a GET request and return all User deliver', inject(function () {

        $scope.vm.readDeliverid();

        // Test form inputs are reset
        if ($scope.vm.requestorder._id) {
          if ($scope.vm.requestorder.delivery.deliveryid === '1' && ($scope.vm.authentication.user.roles[0] === 'admin' || $scope.vm.authentication.user.roles[0] === 'user' || $scope.vm.authentication.user.roles[0] === 'deliver')) {
            expect($scope.vm.show).toEqual(false);
          } else if ($scope.vm.requestorder.delivery.deliveryid === '0' && ($scope.vm.authentication.user.roles[0] === 'user' || $scope.vm.authentication.user.roles[0] === 'deliver')) {
            expect($scope.vm.show).toEqual(false);
          } else if ($scope.vm.requestorder.deliverystatus === 'accept' && $scope.vm.authentication.user.roles[0] === 'admin') {
            expect($scope.vm.show).toEqual(false);
            expect($scope.vm.showdetail).toEqual(false);
          }
        } else if (!$scope.vm.requestorder._id) {
          if ($scope.vm.authentication.user.roles[0] === 'user' || $scope.vm.authentication.user.roles[0] === 'deliver') {
            expect($scope.vm.show).toEqual(false);
          }
        }
      }));
    });

    describe('vm.readDeliver() as read', function () {
      var mockDeliverList;

      beforeEach(function () {
        mockDeliverList = [mockDeliver, mockDeliver, mockDeliver];
      });

      it('should send a GET request and return all User deliver', inject(function (Users) {

        $scope.vm.readDeliver();
        if ($scope.vm.authentication.user.roles[0] === 'admin') {
          expect($scope.vm.delivers.length).toEqual(3);
          expect($scope.vm.delivers[0]).toEqual(mockDeliver);
          expect($scope.vm.delivers[1]).toEqual(mockDeliver);
          expect($scope.vm.delivers[2]).toEqual(mockDeliver);
        }

      }));
    });

    describe('vm.readCustomer() as read', function () {


      beforeEach(function () {
        $scope.vm.customers = [mockCustomer, mockCustomer, mockCustomer];
      });

      it('should send a GET request and return all User', inject(function (Users) {

        $scope.vm.readCustomer();
        if ($scope.vm.authentication.user.roles[0] === 'user') {
          expect($scope.vm.customers.length).toEqual(3);
          expect($scope.vm.customers[0]).toEqual(mockCustomer);
          expect($scope.vm.customers[1]).toEqual(mockCustomer);
          expect($scope.vm.customers[2]).toEqual(mockCustomer);
        }

      }));
    });

    describe('vm.selectCustomer() as read', function () {


      beforeEach(function () {
        $scope.vm.cust = mockCustomer;
        $scope.vm.requestorder = mockRequestorder;
      });

      it('should send a GET request and return all User', inject(function () {

        $scope.vm.selectCustomer($scope.vm.cust);

        expect($scope.vm.requestorder.shipping.firstname).toEqual($scope.vm.cust.firstName);
        expect($scope.vm.requestorder.shipping.lastname).toEqual($scope.vm.cust.lastName);
        expect($scope.vm.requestorder.shipping.tel).toEqual($scope.vm.cust.address.tel);
        expect($scope.vm.requestorder.shipping.address).toEqual($scope.vm.cust.address.address);
        expect($scope.vm.requestorder.shipping.subdistrict).toEqual($scope.vm.cust.address.subdistrict);
        expect($scope.vm.requestorder.shipping.district).toEqual($scope.vm.cust.address.district);
        expect($scope.vm.requestorder.shipping.province).toEqual($scope.vm.cust.address.province);
        expect($scope.vm.requestorder.shipping.postcode).toEqual($scope.vm.cust.address.postcode);
        expect($scope.vm.requestorder.shipping.email).toEqual($scope.vm.cust.email);

      }));
    });

    describe('vm.selectDeliver() as read', function () {
      beforeEach(function () {
        $scope.vm.deliver = mockDeliver;
        $scope.vm.requestorder = mockRequestorder;
      });

      it('should send a GET request and return all User', inject(function () {

        $scope.vm.selectDeliver($scope.vm.deliver);
        expect($scope.vm.requestorder.shipping.firstname).toEqual($scope.vm.deliver.firstName);
        expect($scope.vm.requestorder.shipping.lastname).toEqual($scope.vm.deliver.lastName);
        expect($scope.vm.requestorder.shipping.tel).toEqual($scope.vm.deliver.address.tel);
        expect($scope.vm.requestorder.shipping.address).toEqual($scope.vm.deliver.address.address);
        expect($scope.vm.requestorder.shipping.subdistrict).toEqual($scope.vm.deliver.address.subdistrict);
        expect($scope.vm.requestorder.shipping.district).toEqual($scope.vm.deliver.address.district);
        expect($scope.vm.requestorder.shipping.province).toEqual($scope.vm.deliver.address.province);
        expect($scope.vm.requestorder.shipping.postcode).toEqual($scope.vm.deliver.address.postcode);
        expect($scope.vm.requestorder.shipping.email).toEqual($scope.vm.deliver.email);
        expect($scope.vm.requestorder.namedeliver).toEqual($scope.vm.deliver);
      }));
    });

    // describe('vm.updateDeliver', function () {
    //   beforeEach(function () {
    //     // Mock Order in $scope
    //     $scope.vm.requestorder = mockRequestRequestorder;
    //     $scope.vm.requestorder.historystatus = [{
    //       status: 'request',
    //       datestatus: '10/11/2015'
    //     }];
    //   });
    //   it('vm.status updateDeliver()', inject(function (Users) {

    //     // Set PUT response
    //     $httpBackend.expectPUT(/api\/requestorders\/([0-9a-fA-F]{24})$/).respond();

    //     // Run controller functionality
    //     $scope.vm.updateDeliver();
    //     expect($scope.vm.requestorder.deliverystatus).toEqual('request');
    //     $scope.vm.addHis();
    //     $httpBackend.flush();

    //   }));
    // });

    describe('vm.addHis', function () {

      beforeEach(function () {
        $scope.vm.requestorder.historystatus = [{
          status: 'request',
          datestatus: '10/11/2015'
        }];
      });

      it('should addHis', function () {
        $scope.vm.addHis();

        expect($scope.vm.requestorder.historystatus[0].status).toEqual('request');
      });
    });

    describe('vm.addItem', function () {

      beforeEach(function () {
        $scope.vm.requestorder.items = [{
          product: mockProduct,
          qty: 1
        },
        {
          product: mockProduct,
          qty: 1,
          amount: 100
        }];
      });

      it('should addItem', function () {
        $scope.vm.addItem();

        expect($scope.vm.requestorder.items.length).toEqual(3);
      });


    });

    describe('vm.selectedProduct', function () {

      beforeEach(function () {
        $scope.vm.requestorder.items = [{
          product: mockProduct,
          qty: 1
        },
        {
          product: mockProduct,
          qty: 1,
          amount: 100
        }];
      });

      it('should selectedProduct', function () {
        $scope.vm.selectedProduct();

        expect($scope.vm.requestorder.items.length).toEqual(3);
      });


    });

    describe('vm.removeItem', function () {

      beforeEach(function () {
        $scope.vm.requestorder.items = [{
          product: mockProduct,
          qty: 1
        },
        {
          product: mockProduct,
          qty: 1,
          amount: 100
        }];
      });

      it('should removeItem', function () {
        $scope.vm.removeItem($scope.vm.requestorder.items[0]);

        expect($scope.vm.requestorder.items.length).toEqual(1);
      });


    });

    describe('vm.selectProduct', function () {

      beforeEach(function () {
        $scope.vm.requestorder.items = [{
          product: mockProduct,
          qty: 1
        },
        {
          product: mockProduct,
          qty: 1,
          amount: 100
        }];
      });

      // it('should select product item', function () {
      //   $scope.vm.calculate($scope.vm.requestorder.items[0]);
      //   expect($scope.vm.requestorder.items[0].qty).toEqual(1);
      //   expect($scope.vm.requestorder.items[0].amount).toEqual($scope.vm.requestorder.items[0].product.price * $scope.vm.requestorder.items[0].qty);
      // });

      // it('should  qty changed', function () {
      //   $scope.vm.requestorder.items[0].qty = 2;
      //   $scope.vm.calculate($scope.vm.requestorder.items[0]);
      //   expect($scope.vm.requestorder.items[0].qty).toEqual(2);
      //   expect($scope.vm.requestorder.items[0].amount).toEqual($scope.vm.requestorder.items[0].product.price * $scope.vm.requestorder.items[0].qty);
      // });


    });

    describe('vm.save() as create', function () {
      var sampleRequestorderPostData;

      beforeEach(function () {
        // Create a sample Requestorder object
        sampleRequestorderPostData = new RequestordersService({
          name: 'Requestorder Name',
           docno: '1234',
          user: {
            _id: '22222'
          },
          namedeliver: {
            _id: '22222'
          },
          historystatus: [{
            status: 'request',
            datestatus: '10/12/2000'
          }]

        });

        $scope.vm.requestorder = sampleRequestorderPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (RequestordersService) {
        // Set POST response
        $httpBackend.expectPOST('api/requestorders', sampleRequestorderPostData).respond(sampleRequestorderPostData);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('requestorders.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/requestorders', sampleRequestorderPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Requestorder in $scope
        $scope.vm.requestorder = mockRequestorder;
      });

      it('should update a valid Requestorder', inject(function (RequestordersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/requestorders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        // expect($state.go).toHaveBeenCalledWith('requestorders.view', {
        //   requestorderId: mockRequestorder._id
        // });
        expect($state.go).toHaveBeenCalledWith('requestorders.list');
      }));

      it('should set $scope.vm.error if error', inject(function (RequestordersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/requestorders\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Requestorders
        $scope.vm.requestorder = mockRequestorder;
      });

      it('should delete the Requestorder and redirect to Requestorders', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/requestorders\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('requestorders.list');
      });

      it('should should not delete the Requestorder and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
