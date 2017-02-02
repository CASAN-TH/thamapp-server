(function () {
  'use strict';

  angular
    .module('pushnotiusers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Pushnotiusers',
      state: 'pushnotiusers',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pushnotiusers', {
      title: 'List Pushnotiusers',
      state: 'pushnotiusers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pushnotiusers', {
      title: 'Create Pushnotiuser',
      state: 'pushnotiusers.create',
      roles: ['admin']
    });
  }
}());
