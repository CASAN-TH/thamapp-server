'use strict';

describe('Dowloads E2E Tests:', function () {
  describe('Test Dowloads page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dowloads');
      expect(element.all(by.repeater('dowload in dowloads')).count()).toEqual(0);
    });
  });
});
