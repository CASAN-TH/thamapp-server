'use strict';

describe('Receivings E2E Tests:', function () {
  describe('Test Receivings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/receivings');
      expect(element.all(by.repeater('receiving in receivings')).count()).toEqual(0);
    });
  });
});
