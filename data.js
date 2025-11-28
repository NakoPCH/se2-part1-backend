// In-memory mock data store used when no MongoDB connection is configured.

export const users = [
  {
    "id": "u1",
    "username": "kyriakipa",
    "password": "omada3",
    "email": "kyriakipa@ece.auth.gr"
  },
  {
    "id": "u2",
    "username": "okanpala",
    "password": "omada3",
    "email": "okanpala@ece.auth.gr"
  },
  {
    "id": "u3",
    "username": "alexlefa",
    "password": "omada3",
    "email": "alexlefa@ece.auth.gr"
  },
  {
    "id": "u4",
    "username": "elefkapo",
    "password": "omada3",
    "email": "elefkapo@ece.auth.gr"
  },
  {
    "id": "u5",
    "username": "okanako",
    "password": "1234",
    "email": "okanpala@ece.auth.gr"
  }
];
export const houses = [
  {
    "id": "h1",
    "name": "Kyriakipa Main House",
    "ownerId": "u1",
    "address": "123 Main St",
    "maxDevices": 500
  }
];
export const rooms = [
  {
    "id": "r1",
    "name": "Living Room",
    "houseId": "h1"
  },
  {
    "id": "r2",
    "name": "Bedroom",
    "houseId": "h1"
  }
];
export const devices = [
  {
    "id": "d1",
    "name": "Living Room Thermostat",
    "roomId": "r1",
    "type": "thermostat",
    "category": "climate",
    "status": "online",
    "state": {
      "temperature": 22,
      "unit": "C",
      "mode": "auto"
    }
  },
  {
    "id": "d2",
    "name": "Ceiling Light",
    "roomId": "r1",
    "type": "light",
    "category": "lighting",
    "status": "online",
    "state": {
      "brightness": 70,
      "on": true
    }
  },
  {
    "id": "d3",
    "name": "Front Door Camera",
    "roomId": "r2",
    "type": "camera",
    "category": "security",
    "status": "online",
    "state": {
      "recording": false
    }
  }
];
export const automations = [
  {
    "id": "a1",
    "name": "Night mode",
    "ownerId": "u1",
    "rules": [
      {
        "deviceId": "d2",
        "action": {
          "on": false
        },
        "trigger": "23:00"
      }
    ]
  }
];
export const scenarios = [
  {
    "id": "s1",
    "name": "Movie Time",
    "ownerId": "u1",
    "steps": [
      {
        "deviceId": "d2",
        "action": {
          "brightness": 30,
          "on": true
        }
      },
      {
        "deviceId": "d1",
        "action": {
          "temperature": 21
        }
      }
    ]
  }
];
export const widgets = [
  {
    "id": "w1",
    "userId": "u1",
    "type": "temperature",
    "config": {
      "roomId": "r1"
    }
  }
];
export const notifications = [
  {
    "id": "n1",
    "userId": "u1",
    "title": "Welcome",
    "message": "Welcome to Smart Home!",
    "read": false,
    "createdAt": "2025-11-28T17:10:17.942Z"
  }
];