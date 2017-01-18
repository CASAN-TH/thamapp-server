'use strict';

(function () {
  // Assignlist Controller Spec
  describe('Assignlist Controller Tests', function () {
    // Initialize global variables
    var AssignlistController,
      $scope,
      $httpBackend,
      $stateParams,
      $location,
      Users,
      Authentication,
      OrdersService,
      mockOrder,
      mockOrder2,
      mockOrder3,
      mockDeliver;

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
    beforeEach(inject(function ($controller, _$stateParams_, _$location_, $rootScope, _$state_, _$httpBackend_, _Users_, _Authentication_, _OrdersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Users = _Users_;
      Authentication = _Authentication_;
      OrdersService = _OrdersService_;

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
        namedeliver:{
          _id:'123456'
        },
        deliverystatus : 'confirmed'
      });

      mockOrder2 = new OrdersService({
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
        namedeliver:{
          _id:'123456'
        },
        deliverystatus : 'accept'
      });

      mockOrder3 = new OrdersService({
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
        namedeliver:{
          _id:'123456'
        },
        deliverystatus : 'complete'
      });

      Authentication.user = {
        roles: ['deliver']
      };

      // Initialize the Assignlist controller.
      AssignlistController = $controller('AssignlistController as vm', {
        $scope: $scope
      });
    }));

    describe('list order as read', function () {
      var mockOrderList;

      beforeEach(function () {
        mockOrderList = [mockOrder, mockOrder, mockOrder];
      });

      it('should send a GET request and return all order', inject(function (OrdersService) {

        $httpBackend.expectGET('api/orders').respond(mockOrderList);
        $httpBackend.flush();

        expect($scope.vm.orders.length).toEqual(3);
        expect($scope.vm.orders[0]).toEqual(mockOrder);
        expect($scope.vm.orders[1]).toEqual(mockOrder);
        expect($scope.vm.orders[2]).toEqual(mockOrder);

      }));
    });

    describe('list order assign as read', function () {
     

      beforeEach(function () {
        $scope.vm.listOrder = [mockOrder, mockOrder, mockOrder];
        $scope.vm.authentication.user._id = '123456';

      });

      it('should send a GET request and return all list assign', inject(function (OrdersService) {

        $scope.vm.listAssign();

        expect($scope.vm.listOrder.length).toEqual(3);
        expect($scope.vm.listOrder[0].namedeliver._id).toEqual($scope.vm.authentication.user._id);
        expect($scope.vm.listOrder[0].deliverystatus).toEqual('confirmed');

      }));
    });

    describe('list order accept as read', function () {
     

      beforeEach(function () {
        $scope.vm.listOrderAccept = [mockOrder2, mockOrder2];
        $scope.vm.authentication.user._id = '123456';

      });

      it('should send a GET request and return all list accept', inject(function (OrdersService) {

        $scope.vm.listAccept();

        expect($scope.vm.listOrderAccept.length).toEqual(2);
        expect($scope.vm.listOrderAccept[0].namedeliver._id).toEqual($scope.vm.authentication.user._id);
        expect($scope.vm.listOrderAccept[0].deliverystatus).toEqual('accept');

      }));
    });

    describe('list order complete as read', function () {
     

      beforeEach(function () {
        $scope.vm.listOrderComplete = [mockOrder3, mockOrder3];
        $scope.vm.authentication.user._id = '123456';

      });

      it('should send a GET request and return all list complete', inject(function (OrdersService) {

        $scope.vm.listComplete();

        expect($scope.vm.listOrderComplete.length).toEqual(2);
        expect($scope.vm.listOrderComplete[0].namedeliver._id).toEqual($scope.vm.authentication.user._id);
        expect($scope.vm.listOrderComplete[0].deliverystatus).toEqual('complete');

      }));
    });

  });
} ());
