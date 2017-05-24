(function () {
  'use strict';

  angular
    .module('dowloads')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Dowloads',
      state: 'dowloads',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'dowloads', {
      title: 'List Dowloads',
      state: 'dowloads.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'dowloads', {
      title: 'Create Dowload',
      state: 'dowloads.create',
      roles: ['user']
    });
  }
}());
