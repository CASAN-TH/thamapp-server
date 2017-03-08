'use strict';

describe('Returnorders E2E Tests:', function () {
  describe('Test Returnorders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/returnorders');
      expect(element.all(by.repeater('returnorder in returnorders')).count()).toEqual(0);
    });
  });
});
