'use strict';

describe('Adjusts E2E Tests:', function () {
  describe('Test Adjusts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adjusts');
      expect(element.all(by.repeater('adjust in adjusts')).count()).toEqual(0);
    });
  });
});
