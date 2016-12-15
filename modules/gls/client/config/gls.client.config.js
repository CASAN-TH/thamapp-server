(function () {
  'use strict';

  angular
    .module('gls')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Gls',
      state: 'gls',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'gls', {
      title: 'List Gls',
      state: 'gls.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'gls', {
      title: 'Create Gl',
      state: 'gls.create',
      roles: ['user']
    });
  }
}());
