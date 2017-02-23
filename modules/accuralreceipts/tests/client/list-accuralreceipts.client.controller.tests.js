(function () {
  'use strict';

  describe('Accuralreceipts List Controller Tests', function () {
    // Initialize global variables
    var AccuralreceiptsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AccuralreceiptsService,
      mockAccuralreceipt;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AccuralreceiptsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AccuralreceiptsService = _AccuralreceiptsService_;

      // create mock article
      mockAccuralreceipt = new AccuralreceiptsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Accuralreceipt Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Accuralreceipts List controller.
      AccuralreceiptsListController = $controller('AccuralreceiptsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAccuralreceiptList;

      beforeEach(function () {
        mockAccuralreceiptList = [mockAccuralreceipt, mockAccuralreceipt];
      });

      it('should send a GET request and return all Accuralreceipts', inject(function (AccuralreceiptsService) {
        // Set POST response
        $httpBackend.expectGET('api/accuralreceipts').respond(mockAccuralreceiptList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.accuralreceipts.length).toEqual(2);
        expect($scope.vm.accuralreceipts[0]).toEqual(mockAccuralreceipt);
        expect($scope.vm.accuralreceipts[1]).toEqual(mockAccuralreceipt);

      }));
    });
  });
}());
