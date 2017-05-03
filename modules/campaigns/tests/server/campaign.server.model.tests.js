'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Campaign = mongoose.model('Campaign');

/**
 * Globals
 */
var user,
    campaign2,
    campaign;

/**
 * Unit tests
 */
describe('Campaign Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function () {
            campaign = new Campaign({
                name: 'Campaign Name',
                startdate: new Date('2017-04-20'),
                enddate: new Date('2017-04-22'),
                usercount: 0,
                pointcount: 0,
                description: 'description',

                products: [{

                }],
                benefit: {
                    benefittype: 'DC',
                    disctype: 'F',
                    discvalue: 50
                },
                user: user
            });

            campaign2 = new Campaign({
                name: 'Campaign Name',
                startdate: new Date('2017-04-20'),
                enddate: new Date('2017-04-22'),
                usercount: 0,
                pointcount: 0,
                description: 'description',
                products: [{

                }],
                benefit: {
                    benefittype: 'DC',
                    disctype: 'F',
                    discvalue: 50
                },
                user: user
            });
            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            this.timeout(0);
            return campaign.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            campaign.name = '';

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate campaign', function (done) {

            return campaign.save(function (err) {
                should.not.exist(err);
                campaign2.save(function (err) {
                    should.exist(err);
                    done();
                });

            });
        });

        it('should be able to show an error when try to save without startdate', function (done) {
            campaign.startdate = '';

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without enddate', function (done) {
            campaign.enddate = '';

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without usercount', function (done) {
            campaign.usercount = null;

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without products', function (done) {
            campaign.products = null;

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save valid enum value for benefit ', function (done) {
            campaign.benefit = null;

            return campaign.save(function (err) {
                should.exist(err);
                done();
            });
        });

        // it('should be able to show an error when try to save without identification', function(done) {
        //     campaign.listusercampaign[0].identification = null;

        //     return campaign.save(function(err) {
        //         should.exist(err);
        //         done();
        //     });
        // });

        //  it('should be able to show an error when try to save without acceptcampaigndate', function(done) {
        //     campaign.listusercampaign[0].acceptcampaigndate = '';

        //     return campaign.save(function(err) {
        //         should.exist(err);
        //         done();
        //     });
        // });

        it('should be able to update data', function (done) {
            this.timeout(0);
            var data = {
                identification: '1234',
                user: user,
                status: 'accept'
            };
            var data2 = {
                identification: '1234',
                user: user,
                status: 'accept'
            };
            return campaign.save(function (err) {
                should.not.exist(err);
                campaign.listusercampaign.push(data);
                campaign.save(function (err) {
                    should.not.exist(err);
                    campaign.listusercampaign.push(data2);
                    campaign.save(function (err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
        });
    });

    afterEach(function (done) {
        Campaign.remove().exec(function () {
            User.remove().exec(function () {
                done();
            });
        });
    });
});
