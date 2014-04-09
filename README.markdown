# node-evohome

A node.js client library for Honeywell Evohome. A work in progress. Pull-requests welcome!

**Note: This is an unofficial library and is not supported by Honeywell in any way.**

**Use at your own risk. :-)**

## Installing

Install via npm:

```
npm install --save evohome
```

Or, add the following to your package.json dependencies: 

```json
{
	"dependencies": { 
		"evohome": "https://github.com/ixalon/node-evohome.git#v0.0.2"
	}
}	
```

# API

## .login(username, password, applicationId)

Login to Evohome remotely and return a promise which is resolved to a Session on login.

```javascript
	var evohome = require('evohome');
	evohome.login('username', 'password', 'application-id-hex').then(function(session) {
		// Use session to access state
	}).fail(function(err) {
		console.error('Failed to login:', err);
	});
```

## Session

### Session.getLocations()

Returns a promise which is resolved to an array of `Location` objects.

```javascript
	session.getLocations().then(function(locations) {
		console.log('You have', locations.length, 'locations');
	}).fail(function(err) {
		console.error('Failed to get locations:', err);
	});
```

### Session.sessionId

Session ID, sent to all further requests performed under this session.

### Session.userInfo

A `UserInfo` object containing details about the user.

### Session.latestEulaAccepted

`Boolean` value, `false` if there is an updated Honeywell Evohome EULA.

## UserInfo

### UserInfo.userId
The user's unique ID.

### UserInfo.username
The user's username.

### UserInfo.firstname
The user's first name.

### UserInfo.lastname
The user's last name.

### UserInfo.streetAddress
The user's street address.

### UserInfo.city
The user's city.

### UserInfo.state
The user's state/region.

### UserInfo.zipcode
The user's ZIP/Post code.

### UserInfo.country
The user's country.

### UserInfo.telephone
The user's telephone number.

### UserInfo.userLanguage
The user's preferred language.

### UserInfo.isActivated
`Boolean` value, true if the user's account is active.

### UserInfo.deviceCount
The number of devices assigned to this user's account.

## Location

### Location.locationID
TBC.

### Location.name
TBC.

### Location.streetAddress
TBC.

### Location.city
TBC.

### Location.state
TBC.

### Location.country
TBC.

### Location.zipcode
TBC.

### Location.type
TBC.

### Location.devices

An array of `Device` objects.

### Location.oneTouchButtons
TBC.

### Location.daylightSavingTimeEnabled
TBC.

### Location.timeZone
TBC.

### Location.oneTouchActionsSuspended
TBC.

### Location.evoTouchSystemsStatus
TBC.

### Location.isLocationOwner
TBC.

### Location.locationOwnerName
TBC.


## Device

### Device.deviceID
TBC.

### Device.thermostatMoedelType
TBC.

### Device.name
TBC.

### Device.thermostat

A `Thermostat` object.

## Thermostat

### Thermostat.units
TBC.

### Thermostat.indoorTemperature
TBC.

### Thermostat.outdoorTemperature
TBC.

### Thermostat.allowedModes
TBC.

### Thermostat.deadband
TBC.

### Thermostat.minHeatSetpoint
TBC.

### Thermostat.maxHeatSetpoint
TBC.

### Thermostat.minCoolSetpoint
TBC.

### Thermostat.maxCoolSetpoint
TBC.

### Thermostat.changeableValues
TBC.

