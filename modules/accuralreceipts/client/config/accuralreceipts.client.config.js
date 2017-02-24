(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'รายการใบแจ้งหนี้',
      state: 'accuralreceipts',
      type: 'dropdown',
      roles: ['admin', 'deliver']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'accuralreceipts', {
      title: 'List Accuralreceipts',
      state: 'accuralreceipts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'accuralreceipts', {
      title: 'Create Accuralreceipt',
      state: 'accuralreceipts.create',
      roles: ['user']
    });
  }
}());
