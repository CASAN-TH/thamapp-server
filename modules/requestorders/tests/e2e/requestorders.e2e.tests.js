'use strict';

describe('Requestorders E2E Tests:', function () {
  describe('Test Requestorders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/requestorders');
      expect(element.all(by.repeater('requestorder in requestorders')).count()).toEqual(0);
    });
  });
});
