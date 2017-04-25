(function () {
  'use strict';

  describe('Quizzes Controller Tests', function () {
    // Initialize global variables
    var QuizzesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      QuizzesService,
      mockQuiz;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _QuizzesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      QuizzesService = _QuizzesService_;

      // create mock Quiz
      mockQuiz = new QuizzesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Quiz Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Quizzes controller.
      QuizzesController = $controller('QuizzesController as vm', {
        $scope: $scope,
        quizResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleQuizPostData;

      beforeEach(function () {
        // Create a sample Quiz object
        sampleQuizPostData = new QuizzesService({
          name: 'Quiz Name'
        });

        $scope.vm.quiz = sampleQuizPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (QuizzesService) {
        // Set POST response
        $httpBackend.expectPOST('api/quizzes', sampleQuizPostData).respond(mockQuiz);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Quiz was created
        expect($state.go).toHaveBeenCalledWith('quizzes.view', {
          quizId: mockQuiz._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/quizzes', sampleQuizPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Quiz in $scope
        $scope.vm.quiz = mockQuiz;
      });

      it('should update a valid Quiz', inject(function (QuizzesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('quizzes.view', {
          quizId: mockQuiz._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (QuizzesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Quizzes
        $scope.vm.quiz = mockQuiz;
      });

      it('should delete the Quiz and redirect to Quizzes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('quizzes.list');
      });

      it('should should not delete the Quiz and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
