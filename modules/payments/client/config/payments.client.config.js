(function () {
  'use strict';

  angular
    .module('payments')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Payments',
      state: 'payments',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'payments', {
      title: 'List Payments',
      state: 'payments.list'
    });

    // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'payments', {
    //   title: 'Create Payment',
    //   state: 'payments.create',
    //   roles: ['user']
    // });
  }
}());
