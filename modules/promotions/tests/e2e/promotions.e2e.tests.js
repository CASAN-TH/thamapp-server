'use strict';

describe('Promotions E2E Tests:', function () {
  describe('Test Promotions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/promotions');
      expect(element.all(by.repeater('promotion in promotions')).count()).toEqual(0);
    });
  });
});
