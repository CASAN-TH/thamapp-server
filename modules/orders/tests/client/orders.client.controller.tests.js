(function () {
  'use strict';

  describe('Orders Controller Tests', function () {
    // Initialize global variables
    var OrdersController,
      $scope,
      $httpBackend,
      $state,
      Users,
      Authentication,
      OrdersService,
      ProductsService,
      ShopCartService,
      mockProduct,
      mockDeliver,
      mockStatusOrder,
      mockCustomer,
      mockHisStatus,
      mockRejectOrder,
      mockOrder;


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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Users_, _Authentication_, _OrdersService_, _ProductsService_, _ShopCartService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Users = _Users_;
      Authentication = _Authentication_;
      OrdersService = _OrdersService_;
      ProductsService = _ProductsService_;
      ShopCartService = _ShopCartService_;

      // create mock Order
      mockRejectOrder = new OrdersService({
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
        deliverystatus: 'reject'
      });

      mockOrder = new OrdersService({
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
        amount: 30,
        discount: 20,
        namedeliver:{
          displayName: 'deliver2 deliver2'
        }
      });

      mockHisStatus = new OrdersService({
        historystatus: [{
          status: 'pending',
          datestatus: '10/11/2015'
        }]
      });

      mockStatusOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        docno: '1234',
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
        ]
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

      ShopCartService.cart.add(mockProduct);
      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Orders controller.
      OrdersController = $controller('OrdersController as vm', {
        $scope: $scope,
        orderResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.init() ', function () {
      it('should init', inject(function (ProductsService) {
        $scope.vm.init();
        // expect($scope.vm.order.docdate).toEqual(new Date());
        expect($scope.vm.order.items.length).toEqual(1);
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
        if ($scope.vm.order._id) {
          if ($scope.vm.order.delivery.deliveryid === '1' && ($scope.vm.authentication.user.roles[0] === 'admin' || $scope.vm.authentication.user.roles[0] === 'user' || $scope.vm.authentication.user.roles[0] === 'deliver')) {
            expect($scope.vm.show).toEqual(false);
          } else if ($scope.vm.order.delivery.deliveryid === '0' && ($scope.vm.authentication.user.roles[0] === 'user' || $scope.vm.authentication.user.roles[0] === 'deliver')) {
            expect($scope.vm.show).toEqual(false);
          } else if ($scope.vm.order.deliverystatus === 'accept' && $scope.vm.authentication.user.roles[0] === 'admin') {
            expect($scope.vm.show).toEqual(false);
            expect($scope.vm.showdetail).toEqual(false);
          }
        } else if (!$scope.vm.order._id) {
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

    describe('vm.changeDis() as read', function () {

      it('should send a GET request and return Calculate Discount', inject(function () {

        $scope.vm.changeDis();
        if ($scope.vm.order.discount) {
          expect($scope.vm.order.amount).toEqual($scope.vm.order.amount - $scope.vm.order.discount);
        }
      }));
    });

    describe('vm.selectCustomer() as read', function () {


      beforeEach(function () {
        $scope.vm.cust = mockCustomer;
        $scope.vm.order = mockOrder;
      });

      it('should send a GET request and return all User', inject(function () {

        $scope.vm.selectCustomer($scope.vm.cust);

        expect($scope.vm.order.shipping.firstname).toEqual($scope.vm.cust.firstName);
        expect($scope.vm.order.shipping.lastname).toEqual($scope.vm.cust.lastName);
        expect($scope.vm.order.shipping.tel).toEqual($scope.vm.cust.address.tel);
        expect($scope.vm.order.shipping.address).toEqual($scope.vm.cust.address.address);
        expect($scope.vm.order.shipping.subdistrict).toEqual($scope.vm.cust.address.subdistrict);
        expect($scope.vm.order.shipping.district).toEqual($scope.vm.cust.address.district);
        expect($scope.vm.order.shipping.province).toEqual($scope.vm.cust.address.province);
        expect($scope.vm.order.shipping.postcode).toEqual($scope.vm.cust.address.postcode);
        expect($scope.vm.order.shipping.email).toEqual($scope.vm.cust.email);

      }));
    });
    
    describe('vm.selectDeliver() as read', function () {


      beforeEach(function () {
        $scope.vm.deliver = mockDeliver;
        $scope.vm.order = mockOrder;
      });

      it('should send a GET request and return all User', inject(function () {

        $scope.vm.selectDeliver($scope.vm.deliver);

        expect($scope.vm.order.namedeliver).toEqual($scope.vm.deliver);
      }));
    });

    describe('vm.updateDeliver', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockRejectOrder;
        $scope.vm.order.historystatus = [{
          status: 'wait deliver',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status updateDeliver()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.updateDeliver();
        expect($scope.vm.order.deliverystatus).toEqual('wait deliver');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('vm.addHis', function () {

      beforeEach(function () {
        $scope.vm.order.historystatus = [{
          status: 'pending',
          datestatus: '10/11/2015'
        }];
      });

      it('should addHis', function () {
        $scope.vm.addHis();

        expect($scope.vm.order.historystatus[0].status).toEqual('pending');
      });


    });

    describe('vm.addWait', function () {

      beforeEach(function () {
        $scope.vm.order.historystatus = [{
          status: 'wait deliver',
          datestatus: '10/11/2015'
        }];
      });

      it('should addWait', function () {
        $scope.vm.addWait();

        expect($scope.vm.order.historystatus[0].status).toEqual('wait deliver');
      });


    });

    describe('status updateWaitStatus', function () {

      it('vm.status updateWaitStatus()', inject(function () {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.updateWaitStatus(true);

        if ($scope.vm.order._id) {
          if ($scope.vm.order.namedeliver && ($scope.vm.order.deliverystatus === 'confirmed')) {
            if ($scope.vm.order.deliverystatus === 'wait deliver') {

            } else {
              $scope.vm.order.deliverystatus = 'wait deliver';
              $scope.vm.addHis();
            }
          }
        } else if (!$scope.vm.order._id) {
          if ($scope.vm.order.namedeliver) {
            if ($scope.vm.order.deliverystatus === 'wait deliver') {

            } else {
              $scope.vm.order.deliverystatus = 'wait deliver';
              $scope.vm.addHis();
            }
          }
        }
      }));
    });

    describe('update status pending', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'pending',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status pending()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.pending(true);
        expect($scope.vm.order.deliverystatus).toEqual('pending');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status paid', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'paid',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status paid()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.paid(true);
        expect($scope.vm.order.deliverystatus).toEqual('paid');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status sent', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'sent',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status sent()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.sent(true);
        expect($scope.vm.order.deliverystatus).toEqual('sent');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status complete', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'complete',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status complete()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.complete(true);
        expect($scope.vm.order.deliverystatus).toEqual('complete');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status closeOrder', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'close',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status closeOrder()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.closeOrder(true);
        expect($scope.vm.order.deliverystatus).toEqual('close');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status acceptOrder', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'accept',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status acceptOrder()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.acceptOrder(true);
        expect($scope.vm.order.deliverystatus).toEqual('accept');
        $scope.vm.addHis();
        $httpBackend.flush();

      }));
    });

    describe('update status rejectOrder', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
        $scope.vm.order.historystatus = [{
          status: 'reject',
          datestatus: '10/11/2015'
        }];
      });
      it('vm.status rejectOrder()', inject(function (Users) {

        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.rejectOrder(true);
        expect($scope.vm.order.deliverystatus).toEqual('reject');
        expect($scope.vm.order.namedeliver).toEqual(null);
        $scope.vm.addHis();
        $httpBackend.flush();
      }));
    });

    describe('vm.selectProduct', function () {

      beforeEach(function () {
        $scope.vm.order.items = [{
          product: mockProduct,
          qty: 1
        },
        {
          product: mockProduct,
          qty: 1,
          amount: 100
        }];
      });

      it('should select product item', function () {
        $scope.vm.productChanged($scope.vm.order.items[0]);
        expect($scope.vm.order.items[0].qty).toEqual(1);
        expect($scope.vm.order.items[0].amount).toEqual($scope.vm.order.items[0].product.price * $scope.vm.order.items[0].qty);
        expect($scope.vm.order.amount).toEqual(200);
      });

      it('should  qty changed', function () {
        $scope.vm.order.items[0].qty = 2;
        $scope.vm.calculate($scope.vm.order.items[0]);
        expect($scope.vm.order.items[0].qty).toEqual(2);
        expect($scope.vm.order.items[0].amount).toEqual($scope.vm.order.items[0].product.price * $scope.vm.order.items[0].qty);
        expect($scope.vm.order.amount).toEqual(300);
      });


    });

    describe('vm.addItem', function () {

      beforeEach(function () {
        $scope.vm.order.items = [{
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

        expect($scope.vm.order.items.length).toEqual(3);
      });


    });
    describe('vm.selectedProduct', function () {

      beforeEach(function () {
        $scope.vm.order.items = [{
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

        expect($scope.vm.order.items.length).toEqual(3);
      });


    });

    describe('vm.removeItem', function () {

      beforeEach(function () {
        $scope.vm.order.items = [{
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
        $scope.vm.removeItem($scope.vm.order.items[0]);

        expect($scope.vm.order.items.length).toEqual(1);
        expect($scope.vm.order.amount).toEqual(100);
      });


    });
    describe('vm.save() as create', function () {
      var sampleOrderPostData;

      beforeEach(function () {
        // Create a sample Order object
        sampleOrderPostData = new OrdersService({
          docno: '1234'
        });

        $scope.vm.order = sampleOrderPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (OrdersService) {
        // Set POST response
        $httpBackend.expectPOST('api/orders', sampleOrderPostData).respond(mockOrder);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Order was created
        expect($state.go).toHaveBeenCalledWith('orders.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/orders', sampleOrderPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Order in $scope
        $scope.vm.order = mockOrder;
      });

      it('should update a valid Order', inject(function (OrdersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('orders.list');
      }));

      it('should set $scope.vm.error if error', inject(function (OrdersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/orders\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Orders
        $scope.vm.order = mockOrder;
      });

      it('should delete the Order and redirect to Orders', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/orders\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('orders.list');
      });

      it('should should not delete the Order and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });

    afterEach(inject(function (_ShopCartService_) {

      ShopCartService = _ShopCartService_;
      ShopCartService.cart.clear();

    }));

  });
} ());
