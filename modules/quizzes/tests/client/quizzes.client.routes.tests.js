(function () {
  'use strict';

  describe('Quizzes Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuizzesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuizzesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuizzesService = _QuizzesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('quizzes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/quizzes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QuizzesController,
          mockQuiz;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('quizzes.view');
          $templateCache.put('modules/quizzes/client/views/view-quiz.client.view.html', '');

          // create mock Quiz
          mockQuiz = new QuizzesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quiz Name'
          });

          // Initialize Controller
          QuizzesController = $controller('QuizzesController as vm', {
            $scope: $scope,
            quizResolve: mockQuiz
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:quizId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.quizResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            quizId: 1
          })).toEqual('/quizzes/1');
        }));

        it('should attach an Quiz to the controller scope', function () {
          expect($scope.vm.quiz._id).toBe(mockQuiz._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/quizzes/client/views/view-quiz.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuizzesController,
          mockQuiz;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('quizzes.create');
          $templateCache.put('modules/quizzes/client/views/form-quiz.client.view.html', '');

          // create mock Quiz
          mockQuiz = new QuizzesService();

          // Initialize Controller
          QuizzesController = $controller('QuizzesController as vm', {
            $scope: $scope,
            quizResolve: mockQuiz
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.quizResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/quizzes/create');
        }));

        it('should attach an Quiz to the controller scope', function () {
          expect($scope.vm.quiz._id).toBe(mockQuiz._id);
          expect($scope.vm.quiz._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/quizzes/client/views/form-quiz.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuizzesController,
          mockQuiz;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('quizzes.edit');
          $templateCache.put('modules/quizzes/client/views/form-quiz.client.view.html', '');

          // create mock Quiz
          mockQuiz = new QuizzesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quiz Name'
          });

          // Initialize Controller
          QuizzesController = $controller('QuizzesController as vm', {
            $scope: $scope,
            quizResolve: mockQuiz
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:quizId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.quizResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            quizId: 1
          })).toEqual('/quizzes/1/edit');
        }));

        it('should attach an Quiz to the controller scope', function () {
          expect($scope.vm.quiz._id).toBe(mockQuiz._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/quizzes/client/views/form-quiz.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
