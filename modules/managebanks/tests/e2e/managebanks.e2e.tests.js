'use strict';

describe('Managebanks E2E Tests:', function () {
  describe('Test Managebanks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/managebanks');
      expect(element.all(by.repeater('managebank in managebanks')).count()).toEqual(0);
    });
  });
});
