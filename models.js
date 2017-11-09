const mongoose = require('mongoose');

const bathroomSchema = mongoose.Schema({
	type: {type: String, required: true},
	city: {type: String, required: true},
	name: {type: String, required: true},
	address: {
		street: {type: String, required: true},
		state: {type: String, required: true}
	},
	zipcode: {type: String, required: true}
});

bathroomSchema.virtual('addressString').get(function() {
	return `${this.address.street} ${this.address.state}`.trim()
});

bathroomSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		type: this.type,
		city: this.city,
		name: this.name,
		address: this.address,
		zipcode: this.zipcode
	};
}

const Bathroom = mongoose.model('Bathroom', bathroomSchema);
	
module.exports = {Bathroom};