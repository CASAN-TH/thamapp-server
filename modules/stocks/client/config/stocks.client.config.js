(function () {
  'use strict';

  angular
    .module('stocks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Stocks',
      state: 'stocks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'stocks', {
      title: 'List Stocks',
      state: 'stocks.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'stocks', {
      title: 'Create Stock',
      state: 'stocks.create',
      roles: ['user']
    });
  }
}());
