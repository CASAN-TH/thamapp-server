'use strict';

describe('Accuralreceipts E2E Tests:', function () {
  describe('Test Accuralreceipts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/accuralreceipts');
      expect(element.all(by.repeater('accuralreceipt in accuralreceipts')).count()).toEqual(0);
    });
  });
});
