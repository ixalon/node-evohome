var Q = require('q');
var request = require('request');
var _ = require('lodash');

function UserInfo(json) {
    this.userID = json.userID;
    this.username = json.username;
    this.firstname = json.firstname;
    this.lastname = json.lastname;
    this.streetAddress = json.streetAddress;
    this.city = json.city;
    this.state = json.state;
    this.zipcode = json.zipcode;
    this.country = json.country;
    this.telephone = json.telephone;
    this.userLanguage = json.userLanguage;
    this.isActivated = json.isActivated;
    this.deviceCount = json.deviceCount;
}

// Private
var sessionCredentials = {};

function Session(username, password, appId, json) {
	this.sessionId = json.sessionId;
	this.userInfo = new UserInfo(json.userInfo);
	this.latestEulaAccepted = json.latestEulaAccepted;

	sessionCredentials[this.sessionId] = {
		username: username,
		password: password,
		appId: appId
	};
}

function Location(json) {
	this.locationID = json.locationID;
	this.name = json.name;
	this.streetAddress = json.streetAddress;
	this.city = json.city;
	this.state = json.state;
	this.country = json.country;
	this.zipcode = json.zipcode;
	this.type = json.type;
	this.devices = _.map(json.devices, function(device) { return new Device(device); });
	this.oneTouchButtons = json.oneTouchButtons;
	this.daylightSavingTimeEnabled = json.daylightSavingTimeEnabled;
	this.timeZone = json.timeZone;
	this.oneTouchActionsSuspended = json.oneTouchActionsSuspended;
	this.evoTouchSystemsStatus = json.evoTouchSystemsStatus;
	this.isLocationOwner = json.isLocationOwner;
	this.locationOwnerName = json.locationOwnerName;
}

function Device(json) {
	this.deviceID = json.deviceID;
	this.thermostatModelType = json.thermostatModelType;
	this.name = json.name;
	this.thermostat = new Thermostat(json.thermostat);
}

function Thermostat(json) {
	this.units = json.units;
	this.indoorTemperature = json.indoorTemperature;
	this.outdoorTemperature = json.outdoorTemperature;
	this.allowedModes = json.allowedModes;
	this.deadband = json.deadband;
	this.minHeatSetpoint = json.minHeatSetpoint;
	this.maxHeatSetpoint = json.maxHeatSetpoint;
	this.minCoolSetpoint = json.minCoolSetpoint;
	this.maxCoolSetpoint = json.maxCoolSetpoint;
	this.changeableValues = json.changeableValues;

}

Session.prototype.getLocations = function() {
	var url = "https://rs.alarmnet.com/TotalConnectComfort/WebAPI/api/locations?userId=" + this.userInfo.userID + "&allData=True";
	return this._request(url).then(function(json) {
		return _.map(json, function(location) {
			return new Location(location);
		});
	});
}

Session.prototype._renew = function() {
	var self = this;
	var credentials = sessionCredentials[this.sessionID];
	return login(credentials.username, credentials.password, credentials.appId).then(function(json) {
		self.sessionId = json.sessionId;
		self.userInfo = new UserInfo(json.userInfo);
		self.latestEulaAccepted = json.latestEulaAccepted;
		return self;
	});
}

Session.prototype._request = function(url) {
	var deferred = Q.defer();
	request({
		method: 'GET',
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'sessionID': this.sessionId
		}
	}, function(err, response) {
		if(err) {
			deferred.reject(err);
		} else {
			var json;
			try {
				json = JSON.parse(response.body);
			} catch(ex) {	
				console.error(ex);
				console.error(response.body);
				console.error(response);
				deferred.reject(ex);
			}
			if(json) {
				deferred.resolve(json);
			}
		}
	});

	return deferred.promise;
}


// sets tepmerature of 'deviceID' to 'temperature' until next programed change
Session.prototype._set_temperature = function(deviceID, temperature) {
	var deferred = Q.defer();
	var url = 'https://tccna.honeywell.com/WebAPI/api/devices/' + deviceID + '/thermostat/changeableValues/heatSetpoint';

	request({
		mehtod: 'POST',
		url: url,    // see above
		headers: {   // headers correct?
			'Content-Type': 'application/json',
			'sessionID': this.sessionId
		},
		body: JSON.stringify({
			// here go the vlaues that get posted // move this into "Function()"??)
			"Value": temperature,
			"Status": "Hold",
			"NextTime": null
		})
	}, function(err, response) {
		if(err) {  // throw error if problem occurs
			deferred.reject(err);
		} else {
			// What does this function give back?
		}
	});
}

function login(username, password, appId) {
	var deferred = Q.defer();
	request({
		method: 'POST',
		url: 'https://rs.alarmnet.com/TotalConnectComfort/WebAPI/api/Session',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Username: username,
			Password: password,
			ApplicationId: appId
		})
	}, function(err, response) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(JSON.parse(response.body));
		}
	});
	return deferred.promise;
}

module.exports = {
	login: function(username, password, appId) {
		return login(username, password, appId).then(function(json) {
			return new Session(username, password, appId, json);
		});
	}
};
