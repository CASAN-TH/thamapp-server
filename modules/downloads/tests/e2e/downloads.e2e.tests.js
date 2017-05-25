'use strict';

describe('Downloads E2E Tests:', function () {
  describe('Test Downloads page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/downloads');
      expect(element.all(by.repeater('download in downloads')).count()).toEqual(0);
    });
  });
});
