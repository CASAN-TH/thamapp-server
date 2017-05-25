(function () {
  'use strict';

  angular
    .module('downloads')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Downloads',
      state: 'downloads',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'downloads', {
      title: 'List Downloads',
      state: 'downloads.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'downloads', {
      title: 'Create Download',
      state: 'downloads.create',
      roles: ['user']
    });
  }
}());
