// Load modules
var chai = require('chai')
  , Hapi = require('hapi');

var collectdVisor = require('../../lib');

var expect = chai.expect;

describe('Routes', function () {

  var server;

  before(function () {
    // load with just the views fragment of the configuration
    server = new Hapi.Server({views: collectdVisor.defaultViewConfig()});
    collectdVisor.routes(server);
  });

  describe('content', function () {

    it('should respond to / with 200 status code', function (done) {
      server.inject({ method: 'GET', url: '/' }, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    it('should respond to /about with 200 status code', function (done) {
      server.inject({ method: 'GET', url: '/about' }, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('host', function () {

    it('should respond to /hosts with 200 status code', function (done) {
      server.inject({ method: 'GET', url: '/hosts' }, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should respond to /hosts with 200 status code', function (done) {
      server.inject({ method: 'GET', url: '/host/ubuntu1204-2server01' }, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should respond to /hosts with 400 status code when bad hostname is supplied', function (done) {
      server.inject({ method: 'GET', url: '/host/ubuntu1204-$$2server01' }, function (res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should respond to /hosts with 404 status code when hostname is not found', function (done) {
      server.inject({ method: 'GET', url: '/host/ubuntu1204-2server0111' }, function (res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });

  });

});