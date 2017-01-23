(function () {
  'use strict';

  describe('Orders List Controller Tests', function () {
    // Initialize global variables
    var OrdersListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      OrdersService,
      mockOrder,
      mockPendingOrderPost,
      mockPendingOrderDeli,
      mockPaidOrderPost,
      mockPaidOrderDeli,
      mockSentOrderPost,
      mockSentOrderDeli,
      mockCompleteOrderPost,
      mockCompleteOrderDeli,
      mockCloseOrderPost,
      mockCloseOrderDeli,
      mockConfirmedOrderPost,
      mockConfirmedOrderDeli,
      mockAcceptDeli,
      mockRejectDeli,
      mockCancelOrderPost,
      mockCancelOrderDeli;


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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _OrdersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      OrdersService = _OrdersService_;

      // create mock article
      mockOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name'
      });

      mockConfirmedOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'confirmed',
        delivery: {
          deliveryid: '1'
        }
      });

      mockConfirmedOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'confirmed',
        delivery: {
          deliveryid: '0'
        }
      });

      mockPendingOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'pending',
        delivery: {
          deliveryid: '1'
        }
      });

      mockPendingOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'pending',
        delivery: {
          deliveryid: '0'
        }
      });

      mockPaidOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'paid',
        delivery: {
          deliveryid: '1'
        }
      });

      mockPaidOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'paid',
        delivery: {
          deliveryid: '0'
        }
      });

      mockSentOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'sent',
        delivery: {
          deliveryid: '1'
        }
      });

      mockSentOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'sent',
        delivery: {
          deliveryid: '0'
        }
      });

      mockCompleteOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'complete',
        delivery: {
          deliveryid: '1'
        }
      });

      mockCompleteOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'complete',
        delivery: {
          deliveryid: '0'
        }
      });

      mockCloseOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'close',
        delivery: {
          deliveryid: '1'
        }
      });

      mockCloseOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'close',
        delivery: {
          deliveryid: '0'
        }
      });

      mockCancelOrderPost = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'cancel',
        delivery: {
          deliveryid: '1'
        }
      });

      mockCancelOrderDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'cancel',
        delivery: {
          deliveryid: '0'
        }
      });

      mockAcceptDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'accept',
        delivery: {
          deliveryid: '0'
        }
      });

      mockRejectDeli = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'reject',
        delivery: {
          deliveryid: '0'
        }
      });
      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Orders List controller.
      OrdersListController = $controller('OrdersListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockOrderList;

      beforeEach(function () {
        mockOrderList = [mockOrder, mockOrder];
      });

      it('should send a GET request and return all Orders', inject(function (OrdersService) {
        // Set POST response
        $httpBackend.expectGET('api/orders').respond(mockOrderList);

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.orders.length).toEqual(2);
        expect($scope.vm.orders[0]).toEqual(mockOrder);
        expect($scope.vm.orders[1]).toEqual(mockOrder);
      }));
    });

    describe('order status confirmed', function () {

      beforeEach(function () {
        $scope.vm.confirmedOrders = [mockConfirmedOrderPost, mockConfirmedOrderDeli];
        $scope.vm.confirmedPost = [mockConfirmedOrderPost];
        $scope.vm.confirmedDeli = [mockConfirmedOrderDeli];
      });

      it('should send a GET request and return all Orders Confirmed status', inject(function () {
        $scope.vm.statusConfirmed();
        // Test form inputs are reset
        expect($scope.vm.confirmedOrders.length).toEqual(2);
        expect($scope.vm.confirmedOrders[0].deliverystatus).toEqual('confirmed');
        expect($scope.vm.confirmedOrders[1].deliverystatus).toEqual('confirmed');
        expect($scope.vm.confirmedPost.length).toEqual(1);
        expect($scope.vm.confirmedPost[0].deliverystatus).toEqual('confirmed');
        expect($scope.vm.confirmedPost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.confirmedDeli.length).toEqual(1);
        expect($scope.vm.confirmedDeli[0].deliverystatus).toEqual('confirmed');
        expect($scope.vm.confirmedDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status pending', function () {
      beforeEach(function () {
        $scope.vm.pendingOrders = [mockPendingOrderPost, mockPendingOrderDeli];
        $scope.vm.pendingPost = [mockPendingOrderPost];
        $scope.vm.pendingDeli = [mockPendingOrderDeli];
      });

      it('should send a GET request and return all Orders pending status', inject(function () {
        $scope.vm.statusPending();
        // Test form inputs are reset
        expect($scope.vm.pendingOrders.length).toEqual(2);
        expect($scope.vm.pendingOrders[0].deliverystatus).toEqual('pending');
        expect($scope.vm.pendingOrders[1].deliverystatus).toEqual('pending');
        expect($scope.vm.pendingPost.length).toEqual(1);
        expect($scope.vm.pendingPost[0].deliverystatus).toEqual('pending');
        expect($scope.vm.pendingPost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.pendingDeli.length).toEqual(1);
        expect($scope.vm.pendingDeli[0].deliverystatus).toEqual('pending');
        expect($scope.vm.pendingDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status paid', function () {

      beforeEach(function () {
        $scope.vm.paidOrders = [mockPaidOrderPost, mockPaidOrderDeli];
        $scope.vm.paidPost = [mockPaidOrderPost];
        $scope.vm.paidDeli = [mockPaidOrderDeli];
      });

      it('should send a GET request and return all Orders paid status', inject(function () {
        $scope.vm.statusPaid();
        // Test form inputs are reset
        expect($scope.vm.paidOrders.length).toEqual(2);
        expect($scope.vm.paidOrders[0].deliverystatus).toEqual('paid');
        expect($scope.vm.paidOrders[1].deliverystatus).toEqual('paid');
        expect($scope.vm.paidPost.length).toEqual(1);
        expect($scope.vm.paidPost[0].deliverystatus).toEqual('paid');
        expect($scope.vm.paidPost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.paidDeli.length).toEqual(1);
        expect($scope.vm.paidDeli[0].deliverystatus).toEqual('paid');
        expect($scope.vm.paidDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status sent', function () {

      beforeEach(function () {
        $scope.vm.sentOrders = [mockSentOrderPost, mockSentOrderDeli];
        $scope.vm.sentPost = [mockSentOrderPost];
        $scope.vm.sentDeli = [mockSentOrderDeli];

      });

      it('should send a GET request and return all Orders sent status', inject(function () {
        $scope.vm.statusSent();
        // Test form inputs are reset
        expect($scope.vm.sentOrders.length).toEqual(2);
        expect($scope.vm.sentOrders[0].deliverystatus).toEqual('sent');
        expect($scope.vm.sentOrders[1].deliverystatus).toEqual('sent');
        expect($scope.vm.sentPost.length).toEqual(1);
        expect($scope.vm.sentPost[0].deliverystatus).toEqual('sent');
        expect($scope.vm.sentPost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.sentDeli.length).toEqual(1);
        expect($scope.vm.sentDeli[0].deliverystatus).toEqual('sent');
        expect($scope.vm.sentDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status complete', function () {

      beforeEach(function () {
        $scope.vm.completeOrders = [mockCompleteOrderPost, mockCompleteOrderDeli];
        $scope.vm.completePost = [mockCompleteOrderPost];
        $scope.vm.completeDeli = [mockCompleteOrderDeli];

      });

      it('should send a GET request and return all Orders complete status', inject(function () {
        $scope.vm.statusComplete();
        // Test form inputs are reset
        expect($scope.vm.completeOrders.length).toEqual(2);
        expect($scope.vm.completeOrders[0].deliverystatus).toEqual('complete');
        expect($scope.vm.completeOrders[1].deliverystatus).toEqual('complete');
        expect($scope.vm.completePost.length).toEqual(1);
        expect($scope.vm.completePost[0].deliverystatus).toEqual('complete');
        expect($scope.vm.completePost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.completeDeli.length).toEqual(1);
        expect($scope.vm.completeDeli[0].deliverystatus).toEqual('complete');
        expect($scope.vm.completeDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status closeOrder', function () {

      beforeEach(function () {
        $scope.vm.closeOrders = [mockCloseOrderPost, mockCloseOrderDeli];
        $scope.vm.closePost = [mockCloseOrderPost];
        $scope.vm.closeDeli = [mockCloseOrderDeli];
      });

      it('should send a GET request and return all Orders close status', inject(function () {
        $scope.vm.statusClose();
        // Test form inputs are reset
        expect($scope.vm.closeOrders.length).toEqual(2);
        expect($scope.vm.closeOrders[0].deliverystatus).toEqual('close');
        expect($scope.vm.closeOrders[1].deliverystatus).toEqual('close');
        expect($scope.vm.closePost.length).toEqual(1);
        expect($scope.vm.closePost[0].deliverystatus).toEqual('close');
        expect($scope.vm.closePost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.closeDeli.length).toEqual(1);
        expect($scope.vm.closeDeli[0].deliverystatus).toEqual('close');
        expect($scope.vm.closeDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status cancelOrder', function () {

      beforeEach(function () {
        $scope.vm.cancelOrders = [mockCancelOrderPost, mockCancelOrderDeli];
        $scope.vm.cancelPost = [mockCancelOrderPost];
        $scope.vm.cancelDeli = [mockCancelOrderDeli];
      });

      it('should send a GET request and return all Orders cancel status', inject(function () {
        $scope.vm.statusCancel();
        // Test form inputs are reset
        expect($scope.vm.cancelOrders.length).toEqual(2);
        expect($scope.vm.cancelOrders[0].deliverystatus).toEqual('cancel');
        expect($scope.vm.cancelOrders[1].deliverystatus).toEqual('cancel');
        expect($scope.vm.cancelPost.length).toEqual(1);
        expect($scope.vm.cancelPost[0].deliverystatus).toEqual('cancel');
        expect($scope.vm.cancelPost[0].delivery.deliveryid).toEqual('1');
        expect($scope.vm.cancelDeli.length).toEqual(1);
        expect($scope.vm.cancelDeli[0].deliverystatus).toEqual('cancel');
        expect($scope.vm.cancelDeli[0].delivery.deliveryid).toEqual('0');

      }));
    });

    describe('order status AcceptOrder', function () {

      beforeEach(function () {
        $scope.vm.acceptDeli = [mockAcceptDeli, mockAcceptDeli];
      });

      it('should send a GET request and return all Orders accept status', inject(function () {
        $scope.vm.readAccept();
        // Test form inputs are reset
        expect($scope.vm.acceptDeli.length).toEqual(2);
        expect($scope.vm.acceptDeli[0].deliverystatus).toEqual('accept');
        expect($scope.vm.acceptDeli[1].deliverystatus).toEqual('accept');

      }));
    });

    describe('order status RejectOrder', function () {

      beforeEach(function () {
        $scope.vm.rejectDeli = [mockRejectDeli, mockRejectDeli];
      });

      it('should send a GET request and return all Orders reject status', inject(function () {
        $scope.vm.readReject();
        // Test form inputs are reset
        expect($scope.vm.rejectDeli.length).toEqual(2);
        expect($scope.vm.rejectDeli[0].deliverystatus).toEqual('reject');
        expect($scope.vm.rejectDeli[1].deliverystatus).toEqual('reject');

      }));
    });

    describe('vm.init() ', function () {
      it('should init', inject(function (OrdersService) {
        $scope.vm.init();
      }));
    });
  });
} ());
