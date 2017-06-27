(function () {
  'use strict';

  angular
    .module('freerices')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Freerices',
      state: 'freerices',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'freerices', {
      title: 'List Freerices',
      state: 'freerices.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'freerices', {
      title: 'Create Freerice',
      state: 'freerices.create',
      roles: ['admin']
    });
  }
}());
