const mongoose = require('mongoose');

const bathroomSchema = mongoose.Schema({
	name: {type: String, required: true},
	hours: {type: String, required: true},
	type: {type: String, require: true},
	address: {
		building: String,
		coord: [String],
		street: String,
		zipcode: String
	},
	safe: {type: String, required: true}
});

bathroomSchema.virtual('addressString').get(function() {
	return `${this.address.building} ${this.address.street}`.trim()
});

bathroomSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		hours: this.hours,
		type: this.type,
		safe: this.safe,
		adress: this.addressString
	};
}

const Bathroom = mongoose.model('Bathroom', bathroomSchema);

module.exports = {Bathroom};