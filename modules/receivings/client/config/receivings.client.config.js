(function () {
  'use strict';

  angular
    .module('receivings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Receivings',
      state: 'receivings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'receivings', {
      title: 'List Receivings',
      state: 'receivings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'receivings', {
      title: 'Create Receiving',
      state: 'receivings.create',
      roles: ['user']
    });
  }
}());
