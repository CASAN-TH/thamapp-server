'use strict';

describe('Marketplans E2E Tests:', function () {
  describe('Test Marketplans page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/marketplans');
      expect(element.all(by.repeater('marketplan in marketplans')).count()).toEqual(0);
    });
  });
});
