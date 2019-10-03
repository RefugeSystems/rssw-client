/**
 * Maps type or class names to the constructor for that named type of noun.
 * 
 * This is used by the Universe when loading and constructing objects.
 * @property availableNouns
 * @type Object
 * @for rsSystem
 */
rsSystem.availableNouns = {};
/**
 * List of all nouns that are currently registered.
 * 
 * Used by system controls for easy reference.
 * @property listingNouns
 * @type Array
 * @for rsSystem
 */
rsSystem.listingNouns = [];

/**
 * Maps type or class names to the constructor for that named type of noun. 
 * @method registerNoun
 * @param {Function | Class} constructor The constructor to use for the named type.
 * @param {String} [name] The name for the noun. Defaults to the name of the constructor.
 */
rsSystem.registerNoun = function(constructor, name) {
	name = name || constructor.name;
	rsSystem.availableNouns[name] = constructor;
	rsSystem.listingNouns.push(name);
};
