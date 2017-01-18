(function () {
  'use strict';

  angular
    .module('managebanks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Managebanks',
      state: 'managebanks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'managebanks', {
      title: 'List Managebanks',
      state: 'managebanks.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'managebanks', {
      title: 'Create Managebank',
      state: 'managebanks.create',
      roles: ['user']
    });
  }
}());
