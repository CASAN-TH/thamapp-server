'use strict';

describe('Gls E2E Tests:', function () {
  describe('Test Gls page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/gls');
      expect(element.all(by.repeater('gl in gls')).count()).toEqual(0);
    });
  });
});
