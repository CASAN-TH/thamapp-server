(function () {
  'use strict';

  angular
    .module('marketplans')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Marketplans',
      state: 'marketplans',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'marketplans', {
      title: 'List Marketplans',
      state: 'marketplans.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'marketplans', {
      title: 'Create Marketplan',
      state: 'marketplans.create',
      roles: ['user']
    });
  }
}());
