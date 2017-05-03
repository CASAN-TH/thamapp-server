'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Campaign = mongoose.model('Campaign'),
    Product = mongoose.model('Product'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    credentials2,
    user,
    user2,
    campaign,
    campaign2,
    campaign3,
    product,
    product2;

/**
 * Campaign routes tests
 */
describe('Campaign CRUD tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };
        credentials2 = {
            username: 'username2',
            password: 'M3@n.jsI$Aw3$0m35'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials2.username,
            password: credentials2.password,
            provider: 'local'
        });

        product = new Product({
            _id: '5885e9bcea48c81000919ff8',
            user: '58631cf0043a1110007dcfd0',
            images: 'http://res.cloudinary.com/hrpqiager/image/upload/v1485171075/d7mt2yhjrwttxdllvnzr.jpg',
            category: 'ข้าวสาร',
            description: 'ข้าวธรรมชาติ ไร้สารเคมี ตั้งแต่กระบวนการเพาะปลูก ที่หมักดองดินด้วยสมุนไพรรสจืดก่อนจะปลูกข้าวพันธุ์สันป่าตอง ใส่ปุ๋ยธรรมชาติสูตรบำรุงดิน แห้งชามน้ำชาม (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืด) เพื่อล้างพิษสารเคมีที่สะสมอยู่ในดินในน้ำ และใส่ปุ๋ยธรรมชาติสูตรเร่งดอกผล (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืดผสมกับผลไม้สุกสีเหลือง) เพื่อบำรุงต้นข้าวให้ออกดอกข้าวเป็นเมล็ดข้าว',
            price: 50,
            __v: 1,
            deliveryratetype: 2,
            grossweight: 1,
            maxstock: 20,
            minstock: 5,
            valuetype1: 0,
            created: '2017-01-23T11:32:12.051Z',
            rangtype2: [
                {
                    min: 1,
                    max: 5,
                    value: 50,
                    _id: '58897fc811ac041000adaaa2'
                },
                {
                    min: 6,
                    max: 10,
                    value: 100,
                    _id: '58897fc811ac041000adaaa1'
                },
                {
                    min: 11,
                    max: 999999999,
                    value: 150,
                    _id: '58897fc811ac041000adaaa0'
                }
            ],
            retailerprice: 40,
            name: 'ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 1 กิโลกรัม'
        });

        product2 = new Product({
            _id: '586e06f5be44cc100062981b',
            user: '58631cf0043a1110007dcfd0',
            images: 'http://res.cloudinary.com/hrpqiager/image/upload/v1483959393/hvoopiqtn4shyk4itp6g.jpg',
            category: 'ข้าวสาร',
            description: 'ข้าวธรรมชาติ ไร้สารเคมี ตั้งแต่กระบวนการเพาะปลูก ที่หมักดองดินด้วยสมุนไพรรสจืดก่อนจะปลูกข้าวพันธุ์สันป่าตอง ใส่ปุ๋ยธรรมชาติสูตรบำรุงดิน แห้งชามน้ำชาม (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืด) เพื่อล้างพิษสารเคมีที่สะสมอยู่ในดินในน้ำ และใส่ปุ๋ยธรรมชาติสูตรเร่งดอกผล (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืดผสมกับผลไม้สุกสีเหลือง) เพื่อบำรุงต้นข้าวให้ออกดอกข้าวเป็นเมล็ดข้าวที่สมบูรณ์',
            price: 200,
            __v: 1,
            deliveryratetype: 1,
            grossweight: 5,
            maxstock: 20,
            minstock: 5,
            valuetype1: 50,
            created: '2017-01-05T08:42:29.760Z',
            rangtype2: [
                {
                    min: null,
                    max: null,
                    value: null,
                    _id: '5889f81759953210003f195f'
                }
            ],
            retailerprice: 180,
            name: 'ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 5 กิโลกรัม'
        });

        // Save a user to the test db and create new Campaign
        user.save(function () {
            product.save(function () {
                product2.save(function () {
                    campaign = {
                        name: 'Campaign name',
                        startdate: new Date('2017-04-20'),
                        enddate: new Date('2017-04-22'),
                        usercount: 2,
                        statuscampaign: 'open',
                        products: [{
                            product: product,
                        }],
                        benefit: {
                            benefittype: 'DC',
                            disctype: 'F',
                            discvalue: 50
                        }
                    };

                    campaign2 = {
                        name: 'Campaign name1',
                        startdate: new Date('2017-04-20'),
                        enddate: new Date('2017-04-22'),
                        usercount: 2,
                        statuscampaign: 'close',
                        products: [{
                            product: product2,
                        }],
                        benefit: {
                            benefittype: 'AP',
                            disctype: 'P',
                            discvalue: 100
                        }
                    };

                    campaign3 = {
                        name: 'Campaign name2',
                        startdate: new Date('2017-04-16'),
                        enddate: new Date('2017-04-18'),
                        usercount: 0,
                        statuscampaign: 'open',
                        products: [{
                            product: product2,
                        }],
                        benefit: {
                            benefittype: 'AP',
                            disctype: 'P',
                            discvalue: 50
                        }
                    };
                    done();
                });
            });
        });
    });

    it('should be able to save a Campaign if logged in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }

                        // Get a list of Campaigns
                        agent.get('/api/campaigns')
                            .end(function (campaignsGetErr, campaignsGetRes) {
                                // Handle Campaigns save error
                                if (campaignsGetErr) {
                                    return done(campaignsGetErr);
                                }

                                // Get Campaigns list
                                var campaigns = campaignsGetRes.body;

                                // Set assertions
                                // (campaigns[0].user._id).should.equal(userId);
                                (campaigns.length).should.match(0);
                                // (campaigns[0].name).should.match('Campaign name');
                                // (campaigns[0].startdate).should.match(new Date('2017-04-20'));
                                // (campaigns[0].enddate).should.match(new Date('2017-04-22'));
                                // (campaigns[0].statuscampaign).should.match('open');
                                // (campaigns[0].usercount).should.equal(2);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Campaign if not logged in', function (done) {
        agent.post('/api/campaigns')
            .send(campaign)
            .expect(403)
            .end(function (campaignSaveErr, campaignSaveRes) {
                // Call the assertion callback
                done(campaignSaveErr);
            });
    });

    it('should not be able to save an Campaign if no name is provided', function (done) {
        // Invalidate name field
        campaign.name = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(400)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Set message assertion
                        (campaignSaveRes.body.message).should.match('Please fill Campaign name');

                        // Handle Campaign save error
                        done(campaignSaveErr);
                    });
            });
    });

    it('should be able to update an Campaign if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }

                        // Update Campaign name
                        campaign.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(200)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Handle Campaign update error
                                if (campaignUpdateErr) {
                                    return done(campaignUpdateErr);
                                }

                                // Set assertions
                                (campaignUpdateRes.body._id).should.equal(campaignSaveRes.body._id);
                                (campaignUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');


                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Campaigns if not signed in', function (done) {
        // Create new Campaign model instance
        var campaignObj = new Campaign(campaign);

        // Save the campaign
        campaignObj.save(function () {
            // Request Campaigns
            request(app).get('/api/campaigns')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(0);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Campaign if not signed in', function (done) {
        // Create new Campaign model instance
        var campaignObj = new Campaign(campaign);

        // Save the Campaign
        campaignObj.save(function () {
            request(app).get('/api/campaigns/' + campaignObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('name', campaign.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Campaign with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/campaigns/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Campaign is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Campaign which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Campaign
        request(app).get('/api/campaigns/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Campaign with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Campaign if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }

                        // Delete an existing Campaign
                        agent.delete('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(200)
                            .end(function (campaignDeleteErr, campaignDeleteRes) {
                                // Handle campaign error error
                                if (campaignDeleteErr) {
                                    return done(campaignDeleteErr);
                                }

                                // Set assertions
                                (campaignDeleteRes.body._id).should.equal(campaignSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Campaign if not signed in', function (done) {
        // Set Campaign user
        campaign.user = user;

        // Create new Campaign model instance
        var campaignObj = new Campaign(campaign);

        // Save the Campaign
        campaignObj.save(function () {
            // Try deleting Campaign
            request(app).delete('/api/campaigns/' + campaignObj._id)
                .expect(403)
                .end(function (campaignDeleteErr, campaignDeleteRes) {
                    // Set message assertion
                    (campaignDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Campaign error error
                    done(campaignDeleteErr);
                });

        });
    });

    it('should be able to get a single Campaign that has an orphaned user reference', function (done) {
        // Create orphan user creds
        var _creds = {
            username: 'orphan',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create orphan user
        var _orphan = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'orphan@test.com',
            username: _creds.username,
            password: _creds.password,
            provider: 'local'
        });

        _orphan.save(function (err, orphan) {
            // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    // Get the userId
                    var orphanId = orphan._id;

                    // Save a new Campaign
                    agent.post('/api/campaigns')
                        .send(campaign)
                        .expect(200)
                        .end(function (campaignSaveErr, campaignSaveRes) {
                            // Handle Campaign save error
                            if (campaignSaveErr) {
                                return done(campaignSaveErr);
                            }

                            // Set assertions on new Campaign
                            (campaignSaveRes.body.name).should.equal(campaign.name);
                            should.exist(campaignSaveRes.body.user);
                            should.equal(campaignSaveRes.body.user._id, orphanId);

                            // force the Campaign to have an orphaned user reference
                            orphan.remove(function () {
                                // now signin with valid user
                                agent.post('/api/auth/signin')
                                    .send(credentials)
                                    .expect(200)
                                    .end(function (err, res) {
                                        // Handle signin error
                                        if (err) {
                                            return done(err);
                                        }

                                        // Get the Campaign
                                        agent.get('/api/campaigns/' + campaignSaveRes.body._id)
                                            .expect(200)
                                            .end(function (campaignInfoErr, campaignInfoRes) {
                                                // Handle Campaign error
                                                if (campaignInfoErr) {
                                                    return done(campaignInfoErr);
                                                }

                                                // Set assertions
                                                (campaignInfoRes.body._id).should.equal(campaignSaveRes.body._id);
                                                (campaignInfoRes.body.name).should.equal(campaign.name);
                                                should.equal(campaignInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    it('should not be able to save an Campaign if no startdate is provided', function (done) {
        // Invalidate name field
        campaign.startdate = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(400)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Set message assertion
                        (campaignSaveRes.body.message).should.match('Please fill Campaign startdate');

                        // Handle Campaign save error
                        done(campaignSaveErr);
                    });
            });
    });

    it('should not be able to save an Campaign if no enddate is provided', function (done) {
        // Invalidate name field
        campaign.enddate = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(400)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Set message assertion
                        (campaignSaveRes.body.message).should.match('Please fill Campaign enddate');

                        // Handle Campaign save error
                        done(campaignSaveErr);
                    });
            });
    });

    it('should not be able to save an Campaign if no usercount is provided', function (done) {
        // Invalidate name field
        campaign.usercount = null;

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(400)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Set message assertion
                        (campaignSaveRes.body.message).should.match('Please fill Campaign usercount');

                        // Handle Campaign save error
                        done(campaignSaveErr);
                    });
            });
    });

    // it('should not be able to save an Campaign if no usercount is identification', function (done) {
    //   // Invalidate name field
    //   campaign.listusercampaign[0].identification = null;

    //   agent.post('/api/auth/signin')
    //     .send(credentials)
    //     .expect(200)
    //     .end(function (signinErr, signinRes) {
    //       // Handle signin error
    //       if (signinErr) {
    //         return done(signinErr);
    //       }

    //       // Get the userId
    //       var userId = user.id;

    //       // Save a new Campaign
    //       agent.post('/api/campaigns')
    //         .send(campaign)
    //         .expect(400)
    //         .end(function (campaignSaveErr, campaignSaveRes) {
    //           // Set message assertion
    //           (campaignSaveRes.body.message).should.match('Please fill Campaign identification');

    //           // Handle Campaign save error
    //           done(campaignSaveErr);
    //         });
    //     });
    // });

    // it('should not be able to save an Campaign if no usercount is acceptcampaigndate', function (done) {
    //   // Invalidate name field
    //   campaign.listusercampaign[0].acceptcampaigndate = '';

    //   agent.post('/api/auth/signin')
    //     .send(credentials)
    //     .expect(200)
    //     .end(function (signinErr, signinRes) {
    //       // Handle signin error
    //       if (signinErr) {
    //         return done(signinErr);
    //       }

    //       // Get the userId
    //       var userId = user.id;

    //       // Save a new Campaign
    //       agent.post('/api/campaigns')
    //         .send(campaign)
    //         .expect(400)
    //         .end(function (campaignSaveErr, campaignSaveRes) {
    //           // Set message assertion
    //           (campaignSaveRes.body.message).should.match('Please fill Campaign acceptcampaigndate');

    //           // Handle Campaign save error
    //           done(campaignSaveErr);
    //         });
    //     });
    // });

    it('should not be able to save an campaign if name is duplicated', function (done) {

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        // Save a new campaign
                        agent.post('/api/campaigns')
                            .send(campaign)
                            .expect(400)
                            .end(function (campaignSaveErr, campaignSaveRes) {
                                // Set message assertion
                                //(campaignSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.campaigns index: docno already exists');
                                (campaignSaveRes.body.message.toLowerCase()).should.containEql('name already exists');

                                // Handle campaign save error
                                done(campaignSaveErr);
                            });

                    });

            });
    });

    it('should be able to update an data', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '1719900283009',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign.listusercampaign = [];
                campaign.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }

                        // Update Campaign name\
                        campaign.listusercampaign[0].status = 'receipts';
                        // campaign.listusercampaign[1].identification = 123789;

                        // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(200)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Handle Campaign update error
                                if (campaignUpdateErr) {
                                    return done(campaignUpdateErr);
                                }

                                // Set assertions
                                (campaignUpdateRes.body._id).should.equal(campaignSaveRes.body._id);
                                (campaignUpdateRes.body.listusercampaign[0].identification).should.match('1719900283009');
                                (campaignUpdateRes.body.listusercampaign[0].status).should.match('receipts');
                                // (campaignUpdateRes.body.listusercampaign[1].identification).should.match(123789);



                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to update an data two user', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '7184567257665',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign.listusercampaign = [];
                // campaign.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        // (campaignSaveRes.body._id).should.equal('');
                        var campid = campaignSaveRes.body._id;
                        // Update Campaign name\
                        campaign.listusercampaign.push(data);
                        // campaign.listusercampaign[1].identification = 123789;

                        var _creds = {
                            username: 'orphan',
                            password: 'M3@n.jsI$Aw3$0m3'
                        };

                        // Create orphan user
                        var _orphan = new User({
                            firstName: 'Full',
                            lastName: 'Name',
                            displayName: 'Full Name',
                            email: 'orphan@test.com',
                            username: _creds.username,
                            password: _creds.password,
                            provider: 'local'
                        });

                        _orphan.save(function (err, orphan) {
                            // Handle save error
                            if (err) {
                                return done(err);
                            }
                            agent.put('/api/campaigns/' + campid)
                                .send(campaign)
                                .expect(200)
                                .end(function (campaignUpdateErr, campaignUpdateRes) {
                                    // Handle Campaign update error
                                    if (campaignUpdateErr) {
                                        return done(campaignUpdateErr);
                                    }

                                    // Set assertions
                                    // (campaignUpdateRes.body).should.equal('');
                                    // (campaignUpdateRes.body.listusercampaign[0].identification).should.match(123789);
                                    // (campaignUpdateRes.body.listusercampaign[0].status).should.match('accept');
                                    // (campaignUpdateRes.body.listusercampaign[1].identification).should.match(123789);
                                    // Call the assertion callback
                                    done();
                                });
                            // agent.post('/api/auth/signin')
                            // .send(_creds)
                            // .expect(200)
                            // .end(function(signinErr, signinRes) {
                            //     // Handle signin error
                            //     if (signinErr) {
                            //         return done(signinErr);
                            //     }
                            //     (campaignSaveRes.body._id).should.equal('a');
                            //     // Get the userId
                            //     var orphanId = orphan._id;
                            //     // Update an existing Campaign

                            // });
                        });
                    });
            });
    });

    it('should be able to save a Campaign check date', function (done) {

        var mockCampaign = new Campaign({
            name: 'Campaign name',
            startdate: new Date('2017-04-23'),
            enddate: new Date('2017-04-22'),
            usercount: 0
        });
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(mockCampaign)
                    .expect(400)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Set message assertion
                        (campaignSaveRes.body.message).should.match('Invalid! please check date!');

                        // Handle Campaign save error
                        done(campaignSaveErr);
                    });
            });
    });

    it('should be able to update an data user not same identification', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '7184567257665',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign.listusercampaign = [];
                campaign.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '1473242537569',
                            user: user,
                            status: 'accept'
                        };
                        campaign.listusercampaign.push(data2);
                        // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(200)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Set message assertion
                                (campaignUpdateRes.body.listusercampaign[0].identification).should.match('7184567257665');
                                (campaignUpdateRes.body.listusercampaign[1].identification).should.match('1473242537569');

                                // Handle Campaign save error
                                done();
                            });
                    });
            });
    });

    it('should be able to update an data user same identification', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '7184567257665',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign.listusercampaign = [];
                campaign.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '7184567257665',
                            user: user,
                            status: 'accept'
                        };
                        campaign.listusercampaign.push(data2);
                        // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(400)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Set message assertion
                                (campaignUpdateRes.body.message).should.match('Identification is already!');
                                // (campaignUpdateRes.body.listusercampaign.length).should.match(1);

                                // Handle Campaign save error
                                done(campaignUpdateErr);
                            });
                    });
            });
    });

    it('should be able to get a list of Campaigns open status 1 close status 1 outofdate 1 enddate -2', function (done) {
        // Create new Campaign model instance
        var campaignObj1 = new Campaign(campaign);
        var campaignObj2 = new Campaign(campaign2);
        var campaignObj3 = new Campaign(campaign3);
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                campaignObj1.enddate = new Date('2020-12-31');
                campaignObj1.save();
                campaignObj2.save();
                campaignObj3.save(function () {
                    // Request Campaigns
                    agent.get('/api/campaigns')
                        .end(function (campaignsGetErr, campaignsGetRes) {
                            // Handle Campaigns save error
                            if (campaignsGetErr) {
                                return done(campaignsGetErr);
                            }

                            // Get Campaigns list
                            var campaigns = campaignsGetRes.body;

                            // Set assertions
                            (campaigns.length).should.match(1);

                            // Call the assertion callback
                            done();
                        });

                });
            });
        // Save the campaign

    });

    it('should be able to update an data user not same identification but limit', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '7184567257665',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign.listusercampaign = [];
                campaign.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '1473242537569',
                            user: user,
                            status: 'accept'
                        };
                        campaign.listusercampaign.push(data2);
                        // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign)
                            .expect(200)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                (campaignUpdateRes.body.listusercampaign[0].identification).should.match('7184567257665');
                                (campaignUpdateRes.body.listusercampaign[1].identification).should.match('1473242537569');
                                var data3 = {
                                    identification: '3088271258405',
                                    user: user,
                                    status: 'accept'
                                };
                                campaign.listusercampaign.push(data3);
                                // // Update an existing Campaign
                                agent.put('/api/campaigns/' + campaignUpdateRes.body._id)
                                    .send(campaign)
                                    .expect(400)
                                    .end(function (campaignUpdateErr, campaignUpdateRes) {
                                        // Set message assertion                                       
                                        (campaignUpdateRes.body.message).should.match('Privilege is full');

                                        // Handle Campaign save error
                                        done(campaignUpdateErr);
                                    });
                            });
                    });
            });
    });

    it('should be able to update an data validate identification 8 length', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '1719900283009',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign2.listusercampaign = [];
                campaign2.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign2)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '71845672',
                            user: user,
                            status: 'accept'
                        };
                        campaign2.listusercampaign.push(data2);
                        // // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign2)
                            .expect(400)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Set message assertion                                       
                                (campaignUpdateRes.body.message).should.match('Wrong Identification!');

                                // Handle Campaign save error
                                done(campaignUpdateErr);
                            });
                    });
            });
    });

    it('should be able to update an data validate identification', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '1719900283009',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign2.listusercampaign = [];
                campaign2.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign2)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '7184567257665',
                            user: user,
                            status: 'accept'
                        };
                        campaign2.listusercampaign.push(data2);
                        // // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign2)
                            .expect(200)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Set message assertion                                       
                                (campaignUpdateRes.body.listusercampaign[0].identification).should.match('1719900283009');
                                (campaignUpdateRes.body.listusercampaign[1].identification).should.match('7184567257665');

                                // Handle Campaign save error
                                done();
                            });
                    });
            });
    });

    it('should be able to update an data validate is not identification', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                var data = {
                    identification: '1719900283009',
                    user: user,
                    status: 'accept'
                };
                // Get the userId
                var userId = user.id;
                campaign2.listusercampaign = [];
                campaign2.listusercampaign.push(data);
                // Save a new Campaign
                agent.post('/api/campaigns')
                    .send(campaign2)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        var data2 = {
                            identification: '7184567257660',
                            user: user,
                            status: 'accept'
                        };
                        campaign2.listusercampaign.push(data2);
                        // // Update an existing Campaign
                        agent.put('/api/campaigns/' + campaignSaveRes.body._id)
                            .send(campaign2)
                            .expect(400)
                            .end(function (campaignUpdateErr, campaignUpdateRes) {
                                // Set message assertion                                       
                                (campaignUpdateRes.body.message).should.match('Your identification is Invalid!');

                                // Handle Campaign save error
                                done(campaignUpdateErr);
                            });
                    });
            });
    });

    it('benefit', function (done) {
        // var campaignObj = new Campaign(campaign);
        // campaignObj.save(function () {
        //     request(app).get('/api/campaigns')
        //         .end(function (req, res) {
        //             (res.body).should.match('');
        //             done();
        //         });
        // });

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                agent.post('/api/campaigns')
                    .send(campaign)
                    .expect(200)
                    .end(function (campaignSaveErr, campaignSaveRes) {
                        // Handle Campaign save error
                        if (campaignSaveErr) {
                            return done(campaignSaveErr);
                        }
                        // Set message assertion                                       
                        (campaignSaveRes.body.name).should.match('Campaign name');
                        (campaignSaveRes.body.products.length).should.match(1);
                        (campaignSaveRes.body.benefit.benefittype).should.match('DC');

                        // Handle Campaign save error
                        done();
                    });
            });

    });


    afterEach(function (done) {
        User.remove().exec(function () {
            Campaign.remove().exec(done);
        });
    });
});
