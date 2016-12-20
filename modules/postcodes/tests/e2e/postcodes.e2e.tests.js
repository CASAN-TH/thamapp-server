'use strict';

describe('Postcodes E2E Tests:', function () {
  describe('Test Postcodes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/postcodes');
      expect(element.all(by.repeater('postcode in postcodes')).count()).toEqual(0);
    });
  });
});
