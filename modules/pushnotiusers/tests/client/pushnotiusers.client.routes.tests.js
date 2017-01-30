(function () {
  'use strict';

  describe('Pushnotiusers Route Tests', function () {
    // Initialize global variables
    var $scope,
      PushnotiusersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PushnotiusersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PushnotiusersService = _PushnotiusersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pushnotiusers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pushnotiusers');
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
          PushnotiusersController,
          mockPushnotiuser;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pushnotiusers.view');
          $templateCache.put('modules/pushnotiusers/client/views/view-pushnotiuser.client.view.html', '');

          // create mock Pushnotiuser
          mockPushnotiuser = new PushnotiusersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pushnotiuser Name'
          });

          // Initialize Controller
          PushnotiusersController = $controller('PushnotiusersController as vm', {
            $scope: $scope,
            pushnotiuserResolve: mockPushnotiuser
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pushnotiuserId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pushnotiuserResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pushnotiuserId: 1
          })).toEqual('/pushnotiusers/1');
        }));

        it('should attach an Pushnotiuser to the controller scope', function () {
          expect($scope.vm.pushnotiuser._id).toBe(mockPushnotiuser._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pushnotiusers/client/views/view-pushnotiuser.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PushnotiusersController,
          mockPushnotiuser;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pushnotiusers.create');
          $templateCache.put('modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html', '');

          // create mock Pushnotiuser
          mockPushnotiuser = new PushnotiusersService();

          // Initialize Controller
          PushnotiusersController = $controller('PushnotiusersController as vm', {
            $scope: $scope,
            pushnotiuserResolve: mockPushnotiuser
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pushnotiuserResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pushnotiusers/create');
        }));

        it('should attach an Pushnotiuser to the controller scope', function () {
          expect($scope.vm.pushnotiuser._id).toBe(mockPushnotiuser._id);
          expect($scope.vm.pushnotiuser._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PushnotiusersController,
          mockPushnotiuser;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pushnotiusers.edit');
          $templateCache.put('modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html', '');

          // create mock Pushnotiuser
          mockPushnotiuser = new PushnotiusersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pushnotiuser Name'
          });

          // Initialize Controller
          PushnotiusersController = $controller('PushnotiusersController as vm', {
            $scope: $scope,
            pushnotiuserResolve: mockPushnotiuser
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pushnotiuserId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pushnotiuserResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pushnotiuserId: 1
          })).toEqual('/pushnotiusers/1/edit');
        }));

        it('should attach an Pushnotiuser to the controller scope', function () {
          expect($scope.vm.pushnotiuser._id).toBe(mockPushnotiuser._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
