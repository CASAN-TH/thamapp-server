(function () {
  'use strict';

  angular
    .module('promotions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Promotions',
      state: 'promotions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'promotions', {
      title: 'List Promotions',
      state: 'promotions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'promotions', {
      title: 'Create Promotion',
      state: 'promotions.create',
      roles: ['user']
    });
  }
}());
