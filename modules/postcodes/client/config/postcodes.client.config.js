(function () {
  'use strict';

  angular
    .module('postcodes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Postcodes',
      state: 'postcodes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'postcodes', {
      title: 'List Postcodes',
      state: 'postcodes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'postcodes', {
      title: 'Create Postcode',
      state: 'postcodes.create',
      roles: ['user']
    });
  }
}());
