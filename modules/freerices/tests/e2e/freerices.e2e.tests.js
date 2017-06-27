'use strict';

describe('Freerices E2E Tests:', function () {
  describe('Test Freerices page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/freerices');
      expect(element.all(by.repeater('freerice in freerices')).count()).toEqual(0);
    });
  });
});
