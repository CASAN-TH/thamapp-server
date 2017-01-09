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
      mockPendingOrder,
      mockPaidOrder,
      mockSentOrder,
      mockCompleteOrder,
      mockCloseOrder,
      mockConfirmedOrder;

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

      mockConfirmedOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'confirmed'
      });

      mockPendingOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'pending'
      });

      mockPaidOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'paid'
      });

      mockSentOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'sent'
      });

      mockCompleteOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'complete'
      });
      
      mockCloseOrder = new OrdersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Order Name',
        docno: '1234',
        docdate: '24/05/2535',
        deliverystatus: 'close'
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
        $scope.vm.confirmedOrders = [mockConfirmedOrder];
      });

      it('should send a GET request and return all Orders Confirmed status', inject(function () {
        $scope.vm.statusConfirmed();
        // Test form inputs are reset
        expect($scope.vm.confirmedOrders.length).toEqual(1);
        expect($scope.vm.confirmedOrders[0].deliverystatus).toEqual('confirmed');

      }));
    });

    describe('order status pending', function () {
      beforeEach(function () {
        $scope.vm.pendingOrders = [mockPendingOrder];
      });

      it('should send a GET request and return all Orders pending status', inject(function () {
        $scope.vm.statusPending();
        // Test form inputs are reset
        expect($scope.vm.pendingOrders.length).toEqual(1);
        expect($scope.vm.pendingOrders[0].deliverystatus).toEqual('pending');

      }));
    });

    describe('order status paid', function () {

      beforeEach(function () {
        $scope.vm.paidOrders = [mockPaidOrder];
      });

      it('should send a GET request and return all Orders paid status', inject(function () {
        $scope.vm.statusPaid();
        // Test form inputs are reset
        expect($scope.vm.paidOrders.length).toEqual(1);
        expect($scope.vm.paidOrders[0].deliverystatus).toEqual('paid');

      }));
    });

    describe('order status sent', function () {

      beforeEach(function () {
        $scope.vm.sentOrders = [mockSentOrder];
      });

      it('should send a GET request and return all Orders sent status', inject(function () {
        $scope.vm.statusSent();
        // Test form inputs are reset
        expect($scope.vm.sentOrders.length).toEqual(1);
        expect($scope.vm.sentOrders[0].deliverystatus).toEqual('sent');

      }));
    });

    describe('order status complete', function () {

      beforeEach(function () {
        $scope.vm.completeOrders = [mockCompleteOrder];
      });

      it('should send a GET request and return all Orders complete status', inject(function () {
        $scope.vm.statusComplete();
        // Test form inputs are reset
        expect($scope.vm.completeOrders.length).toEqual(1);
        expect($scope.vm.completeOrders[0].deliverystatus).toEqual('complete');

      }));
    });

    describe('order status closeOrder', function () {

      beforeEach(function () {
        $scope.vm.closeOrders = [mockCloseOrder];
      });

      it('should send a GET request and return all Orders close status', inject(function () {
        $scope.vm.statusClose();
        // Test form inputs are reset
        expect($scope.vm.closeOrders.length).toEqual(1);
        expect($scope.vm.closeOrders[0].deliverystatus).toEqual('close');

      }));
    });

    describe('vm.init() ', function () {
      it('should init', inject(function (OrdersService) {
        $scope.vm.init();
      }));
    });
  });
} ());
