(function () {
  'use strict';

  angular
    .module('adjusts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Adjusts',
      state: 'adjusts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'adjusts', {
      title: 'List Adjusts',
      state: 'adjusts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'adjusts', {
      title: 'Create Adjust',
      state: 'adjusts.create',
      roles: ['user']
    });
  }
}());
