/**
 * 
 * @class RSUniverse
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSUniverse extends RSObject {
	constructor(details) {
		super(details);
		
		this.connection = {};
		this.connection.maxHistory = 100;
		this.connection.authenticator = null;
		this.connection.user = null;
		this.connection.retries = 0;
		this.connection.reconnecting = false;
		this.connection.closing = false;
		this.connection.master = false;
		this.connection.history = [];
		this.connection.entry = (entry) => {
			if(typeof(entry) === "string") {
				entry = {
					"message":entry
				};
			}
			entry.user = this.connection.user.toJSON();
			entry.time = Date.now();
			this.connection.history.unshift(entry);
			if(this.connection.history.length > this.connection.maxHistory) {
				this.connection.history.pop();
			}
		};
	}
	
	/**
	 * 
	 * @method connect
	 * @param {UserInformation} userInformation
	 * @param {String} address
	 */
	connect(userInformation, address) {
		if(!address) {
			throw new Error("No address specified");
		}
		
		if(!userInformation) {
			userInformation = rsSystem.AnonymousUser;
		}

		this.connection.user = userInformation;
		this.connection.address = address;
		
		return new Promise((done, fail) => {
			this.connection.entry({
				"message": "Connecting to Universe",
				"address": address
			});
			
			var socket = new WebSocket(address + "?authenticator=" + userInformation.token + "&user=" + userInformation.username + "&userid=" + userInformation.id + "&name=" + userInformation.name);
			
			socket.onopen = (event) => {
				this.closing = false;
				this.connection.entry({
					"message": "Connection Established",
					"event": event
				});
				if(this.connection.reconnecting) {
					this.connection.reconnecting = false;
					this.$emit("reconnected", this);
				}
				this.$emit("connected", this);
			};
			
			socket.onerror = (event) => {
				this.connection.entry({
					"message": "Connection Failure",
					"event": event
				});
				rsSystem.log.fatal({
					"message": "Connection Failure",
					"universe": this,
					"error": event
				});
				this.connection.socket = null;
				if(!this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection");
					this.connection.reconnecting = true;
					this.$emit("error", {
						"message": "Connection Issues",
						"universe": this,
						"event": event
					});
				}
				this.reconnect();
			};
			
			socket.onclose = (event) => {
				this.connection.entry({
						"message": "Connection Closed",
						"event": event
					});
				if(!this.connection.closing && !this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection");
					this.connection.reconnecting = true;
					this.$emit("error", {
						"message": "Connection Issues",
						"universe": this,
						"event": event
					});
					this.reconnect(event);
				} else if(this.connection.closing) {
					this.$emit("closed", this);
				}
				this.connection.socket = null;
			};
			
			socket.onmessage = (message) => {
				try {
					this.connection.entry(message, "Message Received");
					message = JSON.parse(message.data);
					message.received = Date.now();
					message.sent = parseInt(message.sent);
					message.event.echo = message.echo;
					this.$emit(message.type, message.event);
					this.connection.entry(message, message.type);
				} catch(exception) {
					console.error("Communication Exception: ", exception);
					this.$emit("warning", {
						"message": {
							"text": "Failed to parse AQ Connection message"
						},
						"fields": {
							"message": message,
							"exception": exception
						}
					});
				}
			};
			
			this.connection.socket = socket;
			this.user = userInformation;
			done();
		});
	}
	
	/**
	 * 
	 * @method reconnect
	 * @param {Object} [event] When available, the event that caused the disconnect. Used to retrieve
	 * 		the error code to determine if reconnecting should be attempted.
	 */
	reconnect(event) {
		setTimeout(() => {
			rsSystem.log.warn("Possible Reconnect: ", event);
			if((!event || event.code <4100) && this.connection.retries < 5) {
				rsSystem.log.warn("Connection Retrying...\n", this);
				this.connection.retries++;
				this.connect(this.connection.user, this.connection.address);
			} else {
				this.$emit("closed", this);
				rsSystem.log.error("Reconnect Giving up\n", this);
			}
		}, 1000);
	}
	
	disconnect() {
		if(!this.connection.socket) {
			this.connection.entry("Unable to disconnect, Universe not connected");
		} else {
			this.connection.entry("Disconnecting");
			this.connection.socket.close();
			this.connection.reconnecting = false;
			this.connection.closing = true;
			this.connection.socket = null;
			this.connection.address = null;
		}
	}
	
	/**
	 * 
	 * @method send
	 * @param {String} type
	 * @param {Object} data
	 */
	send(type, data) {
		data = data || {};
		if(this.connection.socket) {
			this.connection.retries = 0;
			if(typeof data !== "object") {
				throw new Error("Only objects can be sent");
			}
			data = {
				"event": type,
				"data": data,
				"sent": Date.now()
			};
			console.log("Sending: ", data);
			this.connection.socket.send(JSON.stringify(data));
		} else {
			// TODO: Buffer for connection restored
		}
	}
}

