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

		/**
		 * Tracks if the system has been logged out and flags as such to prevent
		 * automatic reconnection attempts.
		 * 
		 * Automatic connection processing tends to be handled in the Connect component.
		 * @property loggedOut
		 * @type Boolean
		 */
		this.index = new SearchIndex();
		this.version = "Disconnected";
		this.debugConnection = false;
		this.initialized = false;
		this.loggedOut = false;
		
		this.processEvent = {};
		this.indexes = {};
		this.echoed = {};
		this.nouns = {};
		
		this.latency = 0;
		
		this.connection = {};
		this.connection.maxHistory = 100;
		this.connection.authenticator = null;
		this.connection.user = null;
		this.connection.reconnectAttempts = 0;
		this.connection.connectMark = 0;
		this.connection.retries = 0;
		this.connection.reconnecting = false;
		this.connection.closing = false;
		this.connection.master = false;
		this.connection.lastError = false;
		this.connection.history = [];
		/**
		 * 
		 * @method connection.entry
		 * @param {String} message String as a short description
		 * @param {Number} [level] See https://github.com/trentm/node-bunyan#levels. Default is 30
		 * @param {Object} [data] Arguments attempt to allocate passed objects here.
		 * @param {Object} [error] Information, is explicit about argument position. 
		 */
		this.connection.entry = (message, level, data, error) => {
			var entry = {};
			
			if(typeof(message) === "object") {
				data = message;
				message = undefined;
			} else if(typeof(message) === "number") {
				level = message;
				message = undefined;
			}
			
			if(level === undefined) {
				level = 30;
			} else if(typeof(level) === "object") {
				data = level;
				level = 30;
			}
			
			entry.user = this.connection.user.toJSON();
			entry.time = Date.now();
			entry.message = message;
			entry.level = level;
			entry.error = error;
			entry.data = data;
			
			this.connection.history.unshift(entry);
			if(this.connection.history.length > this.connection.maxHistory) {
				this.connection.history.pop();
			}
		};
		
		
		if(!details.calculator) {
			this.calculator = new RSCalculator(this);
		}
		
		/**
		 * Logging point for this universe.
		 * @property log
		 * @type RSLog
		 */
		this.log = new RSLog(this);
		
		this.$on("world:state", (event) => {
			if(!this.initialized) {
				this.$emit("initializing", event);
			}
			this.loadState(event);
		});
		
		this.processEvent.ping = (event) => {
			var latency = event.received - event.ping;
			if(this.latency) {
				this.latency = (this.latency + (latency/2))/2;
			} else {
				this.latency = latency/2;
			}
			this.latency = parseInt(this.latency);
		};
		
		var ping = () => {
			this.send("ping", {
				"ping": Date.now()
			});
			setTimeout(ping, 60000);
		};
		
		setTimeout(ping, 10000);
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

		this.version = "Unknown";
		this.connection.user = userInformation;
		this.connection.address = address;
		
		return new Promise((done, fail) => {
			this.loggedOut = false;
			this.connection.entry("Connecting to Universe", {
				"address": address
			});
			
			var socket = new WebSocket(address + "?authenticator=" + userInformation.token + "&username=" + userInformation.username + "&id=" + userInformation.id + "&name=" + userInformation.name + "&passcode=" + userInformation.passcode);
			
			socket.onopen = (event) => {
				this.closing = false;
				this.connection.connectMark = Date.now();
				this.connection.entry("Connection Established", event);
				if(this.connection.reconnecting) {
					this.connection.reconnecting = false;
					this.$emit("reconnected", this);
				}
				this.$emit("connected", this);
			};
			
			socket.onerror = (event) => {
				this.connection.entry("Connection Failure", 50, event);
				rsSystem.log.fatal({
					"message": "Connection Failure",
					"universe": this,
					"error": event
				});
				this.connection.lastErrorAt = Date.now();
				this.connection.lastError = "Connection Fault";
				this.connection.socket = null;
				if(!this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection", 40);
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
				this.connection.entry("Connection Closed", 40, event);
				if(!this.connection.closing && !this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection", 40);
					this.connection.lastErrorAt = Date.now();
					this.connection.lastError = "Connection Fault";
					this.connection.reconnecting = true;
					this.$emit("error", {
						"message": "Connection Issues",
						"universe": this,
						"event": event
					});
					this.reconnect(event);
				} else if(this.connection.closing) {
					this.$emit("disconnected", this);
				}
				this.connection.socket = null;
			};
			
			socket.onmessage = (event) => {
				var message;
				
				this.connection.syncMark = event.time;
				this.connection.last = Date.now();
				
				try {
					message = JSON.parse(event.data);
					message.received = Date.now();
					message.sent = parseInt(message.sent);
					if(message.version && message.version !== this.version) {
						this.version = message.version;
					}
					if(message.echo && message.event && !message.event.echo) {
						message.event.echo = message.echo;
						message.echo = this.echoed[message.echo];
						delete(this.echoed[message.echo]);
					}
					if(this.debugConnection || this.debug) {
						console.log("Connection - Received: ", message);
					}
					
					this.$emit(message.type, message.event);
					this.connection.entry(message.type + " Message received", message.type === "error"?50:30, message);
					if(this.debugConnection || this.debug) {
						console.warn("Emission[" + message.type + ":complete]: ", message.event);
					}
					if(this.processEvent[message.type]) {
						this.processEvent[message.type](message);
					} else {
						this.$emit(message.type + ":complete", message.event);
					}
				} catch(exception) {
					console.error("Communication Exception: ", exception);
					this.connection.entry("Error processing message", 50, event, exception);
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
			
			this.$on("model:deleted", (event) => {
				console.log("Deleting: ", event);
				var record = this.nouns[event.type][event.id];
				if(record) {
					console.warn("Deleting Record: " + event.type + " - " + event.id + ": ", event, record);

					this.index.unindexItem(record);
					if(this.indexes[event.type]) {
						this.indexes[event.type].unindexItem(record);
						delete(this.nouns[event.type][event.id]);
					}
					
					this.$emit("universe:modified", this);
					this.$emit("universe:modified:complete", this);
				}
			});
			
			this.$on("model:modified", (event) => {
//				console.log("Modifying: ", event);
				var record = this.nouns[event.type][event.id];
				if(!record) {
					console.warn("Building new record: " + event.type + " - " + event.id + ": ", event);
					if(!this.nouns[event.type]) {
						this.nouns[event.type] = {};
					}
					this.nouns[event.type][event.id] = new rsSystem.availableNouns[event.type](event.modification, this);
					this.indexes[event.type].indexItem(this.nouns[event.type][event.id]);
					this.index.indexItem(this.nouns[event.type][event.id]);
				}
				setTimeout(() => {
					this.$emit("universe:modified", this);
					this.$emit("universe:modified:complete", this);
				}, 0);
			});
			
			this.$on("control", (event) => {
				if(this.debugConnection) {
					console.warn("Control Event: ", event);
				}
				switch(event.data.control) {
					case "page":
						if(this.checkEventCondition(event.data.condition)) {
							window.location = "#" + event.data.url;
						}
						break;
				}
			});
			
			this.connection.socket = socket;
			this.user = userInformation;
			done();
		});
	}

	/**
	 * 
	 * @method calculateExpression
	 * @param {String} expression 
	 * @param {RSObject} source 
	 * @param {Object} base 
	 * @param {RSObject} target 
	 * @return {String} 
	 */
	calculateExpression(expression, source, base, target) {
		if(this.calculator) {
			return this.calculator.process(expression, source, base, target).toString();
		} else {
			return expression.toString();
		}
	}
	
	/**
	 * 
	 * @method displayExpression
	 * @param {String} expression 
	 * @param {RSObject} source 
	 * @param {Object} base 
	 * @param {RSObject} target  
	 * @return {String} 
	 */
	displayExpression(expression, source, base, target) {
		if(this.calculator) {
			return this.calculator.display(expression, source, base, target).toString();
		} else {
			return expression.toString();
		}
	}
	
	checkEventCondition(condition) {
		if(!condition) {
			return true;
		}
		
		var keys = Object.keys(condition),
			result = true,
			buffer,
			x;
		
		for(x=0; result && x<keys.length; x++) {
			switch(keys[x]) {
				case "hash":
					buffer = new RegExp(condition[keys[x]]);
					result = buffer.test(location.hash);
					break;
				default:
					console.warn("Unknown Event Conditional[" + keys[x] + "]: ", condition);
			}
		}
		
		return result;
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
				this.connection.reconnectAttempts++;
				this.connection.retries++;
				this.connect(this.connection.user, this.connection.address);
			} else {
				this.$emit("disconnected", this);
				rsSystem.log.error("Reconnect Giving up\n", this);
				this.loggedOut = true;
			}
		}, 1000);
	}
	
	/**
	 * 
	 * @method disconnect
	 */
	disconnect() {
		if(!this.connection.socket) {
			this.connection.entry("Unable to disconnect, Universe not connected", 40);
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
	 * @method logout
	 */
	logout() {
		this.loggedOut = true;
		this.disconnect();
	}
	
	/**
	 * 
	 * @param {Object} state
	 * @return {Promise}
	 */
	loadState(state) {
		return new Promise((done, fail) => {
			var keys = Object.keys(state),
				Constructor,
				noun,
				type,
				ids,
				id,
				i,
				t;
			
			keys.unshift("modifierattrs");
			keys.unshift("modifierstats");
			keys.unshift("condition");
//			console.warn("Load State: ", keys, state);
			
			for(t=0; t<keys.length; t++) {
				type = keys[t];
				Constructor = rsSystem.availableNouns[type];
				if(Constructor && state[type]) {
					ids = Object.keys(state[type]);
					if(!this.nouns[type]) {
						this.indexes[type] = new SearchIndex();
						this.nouns[type] = {};
					}
					for(i=0; i<ids.length; i++) {
						id = ids[i];
//						console.log("Loading " + id + ": ", state[type][id]);
						if(this.nouns[type][id]) {
							this.nouns[type][id].loadDelta(state[type][id]);
						} else {
							this.nouns[type][id] = new Constructor(state[type][id], this);
							this.nouns[type][id]._type = type;
							this.indexes[type].indexItem(this.nouns[type][id]);
							this.index.indexItem(this.nouns[type][id]);
						}
						noun = this.nouns[type][id];
//						console.log("Final Noun for " + id + ": ", noun);
					}
				} else {
					rsSystem.log.error("Noun does not have a registered constructor: " + type);
				}
			}
			
			for(i=0; i<this.index.listing.length; i++) {
				if(this.index.listing[i].recalculateProperties) {
					this.index.listing[i].recalculateProperties();
				}
			}
			
			for(i=0; i<this.index.listing.length; i++) {
				if(this.index.listing[i].recalculateProperties) {
					this.index.listing[i].recalculateProperties();
				}
			}
			
			if(!this.initialized) {
				this.initialized = true;
				this.$emit("initialized", this);
			}
			
			this.$emit("universe:modified", this);
		});
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
			if(!data.echo) {
				data.echo = Random.identifier("echo");
			}
			data = {
				"sent": Date.now(),
				"echo": data.echo,
				"event": type,
				"data": data
			};
			if(this.debugConnection) {
				console.log("Connection - Sending: ", data);
			}
			this.echoed[data.echo] = data;
			this.connection.socket.send(JSON.stringify(data));
			return data.data.echo;
		} else {
			// TODO: Buffer for connection restored
		}
	}
}

