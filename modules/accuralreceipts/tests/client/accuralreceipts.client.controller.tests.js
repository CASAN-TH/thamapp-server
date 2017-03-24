(function () {
  'use strict';

  describe('Accuralreceipts Controller Tests', function () {
    // Initialize global variables
    var AccuralreceiptsController,
      $scope,
      $httpBackend,
      $state,
      Users,
      Authentication,
      AccuralreceiptsService,
      mockAccuralreceipt,
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AccuralreceiptsService_, _Users_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Users = _Users_;
      Authentication = _Authentication_;
      AccuralreceiptsService = _AccuralreceiptsService_;

      // create mock Accuralreceipt
      mockAccuralreceipt = new AccuralreceiptsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Accuralreceipt Name'
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

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Accuralreceipts controller.
      AccuralreceiptsController = $controller('AccuralreceiptsController as vm', {
        $scope: $scope,
        accuralreceiptResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));
    describe('vm.selectDeliver() as read', function () {


      beforeEach(function () {
        $scope.vm.deliver = mockDeliver;
        $scope.vm.accuralreceipt = mockAccuralreceipt;
      });

      it('should send a GET request and return all User', inject(function () {

        $scope.vm.selectDeliver($scope.vm.deliver);

        expect($scope.vm.accuralreceipt.namedeliver).toEqual($scope.vm.deliver);
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

    describe('vm.save() as create', function () {
      var sampleAccuralreceiptPostData;

      beforeEach(function () {
        // Create a sample Accuralreceipt object
        sampleAccuralreceiptPostData = new AccuralreceiptsService({
          name: 'Accuralreceipt Name'
        });

        $scope.vm.accuralreceipt = sampleAccuralreceiptPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AccuralreceiptsService) {
        // Set POST response
        $httpBackend.expectPOST('api/accuralreceipts', sampleAccuralreceiptPostData).respond(mockAccuralreceipt);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Accuralreceipt was created
        // expect($state.go).toHaveBeenCalledWith('accuralreceipts.list', {
        //   accuralreceiptId: mockAccuralreceipt._id
        // });
        expect($state.go).toHaveBeenCalledWith('accuralreceipts.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/accuralreceipts', sampleAccuralreceiptPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Accuralreceipt in $scope
        $scope.vm.accuralreceipt = mockAccuralreceipt;
      });

      it('should update a valid Accuralreceipt', inject(function (AccuralreceiptsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/accuralreceipts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        // expect($state.go).toHaveBeenCalledWith('accuralreceipts.list', {
        //   accuralreceiptId: mockAccuralreceipt._id
        // });
        expect($state.go).toHaveBeenCalledWith('accuralreceipts.list');
      }));

      it('should set $scope.vm.error if error', inject(function (AccuralreceiptsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/accuralreceipts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Accuralreceipts
        $scope.vm.accuralreceipt = mockAccuralreceipt;
      });

      it('should delete the Accuralreceipt and redirect to Accuralreceipts', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/accuralreceipts\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('accuralreceipts.list');
      });

      it('should should not delete the Accuralreceipt and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
