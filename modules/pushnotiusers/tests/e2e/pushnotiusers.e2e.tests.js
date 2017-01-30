'use strict';

describe('Pushnotiusers E2E Tests:', function () {
  describe('Test Pushnotiusers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pushnotiusers');
      expect(element.all(by.repeater('pushnotiuser in pushnotiusers')).count()).toEqual(0);
    });
  });
});
