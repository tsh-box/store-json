"use strict";

const EventEmitter = require('events');
const WebSocket = require('ws');

// TODO: Singleton vs OOP?
module.exports = class extends EventEmitter {
	constructor(wss) {
		super();

		this.wss = wss;
		this.clients = {};

		wss.on('connection', (ws) => {
			// If the client made it this far
			// - The macaroon has already been verified an made available
			// - They definitely have access to WS subscription
			var macaroon = ws.upgradeReq.macaroon;

			// TODO: See me-box/databox-store-blob issue #19
			this.clients[macaroon.identifier] = ws;
			ws.on('close', (code, reason) => {
				delete this.clients[macaroon.identifier];
				console.log('Client parted:', macaroon.identifier,code, reason);
			});
		})
	}

	sub() {
		return (req, res) => {
			// NOTE: Don't need to check anyhting here since it's all already covered by the path caveat
			// TODO: See me-box/databox-store-blob issue #19
			const id = req.macaroon.identifier;

			if (!(id in this.clients)) {
				// TODO: See me-box/databox-store-blob issue #19
				res.status(409).send('No open WebSocket connection to client; WebSocket connection must exist before subscription requests');
				return;
			}

			var ws = this.clients[id];

			var listener = (data) => {
				// TODO: Error handling
				console.log("[WS] Sending data");
				if(ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				} else {
					console.log("[WS] Not sending data WS not open");
				}
				//TODO: Logging 
			};

			console.log("[NEW SUBSCRIPTION] ", req.path);
			this.on(req.path, listener);

			ws.on('close', (code, reason) => {
				console.log('Client parted 2:', code, reason);
			});

			res.send();
		};
	}

	unsub() {
		return (req, res) => {
			// TODO: Implement with removeListener like above
			res.sendStatus(501);
		};
	}
};
