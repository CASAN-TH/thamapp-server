(function () {
  'use strict';

  describe('Gls Route Tests', function () {
    // Initialize global variables
    var $scope,
      GlsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GlsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GlsService = _GlsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('gls');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/gls');
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
          GlsController,
          mockGl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('gls.view');
          $templateCache.put('modules/gls/client/views/view-gl.client.view.html', '');

          // create mock Gl
          mockGl = new GlsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gl Name'
          });

          // Initialize Controller
          GlsController = $controller('GlsController as vm', {
            $scope: $scope,
            glResolve: mockGl
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:glId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.glResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            glId: 1
          })).toEqual('/gls/1');
        }));

        it('should attach an Gl to the controller scope', function () {
          expect($scope.vm.gl._id).toBe(mockGl._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/gls/client/views/view-gl.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GlsController,
          mockGl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('gls.create');
          $templateCache.put('modules/gls/client/views/form-gl.client.view.html', '');

          // create mock Gl
          mockGl = new GlsService();

          // Initialize Controller
          GlsController = $controller('GlsController as vm', {
            $scope: $scope,
            glResolve: mockGl
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.glResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/gls/create');
        }));

        it('should attach an Gl to the controller scope', function () {
          expect($scope.vm.gl._id).toBe(mockGl._id);
          expect($scope.vm.gl._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/gls/client/views/form-gl.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GlsController,
          mockGl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('gls.edit');
          $templateCache.put('modules/gls/client/views/form-gl.client.view.html', '');

          // create mock Gl
          mockGl = new GlsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gl Name'
          });

          // Initialize Controller
          GlsController = $controller('GlsController as vm', {
            $scope: $scope,
            glResolve: mockGl
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:glId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.glResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            glId: 1
          })).toEqual('/gls/1/edit');
        }));

        it('should attach an Gl to the controller scope', function () {
          expect($scope.vm.gl._id).toBe(mockGl._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/gls/client/views/form-gl.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
