const mongoose = require('mongoose');

const bathroomSchema = mongoose.Schema({
	type: {type: String, required: true},
	city: {type: String, required: true},
	name: {type: String, required: true},
<<<<<<< HEAD
	hours: {type: String, required: true},
	address: {
		street: String,
		zipcode: String
	}
});

bathroomSchema.virtual('addressString').get(function() {
	return `${this.address.street} ${this.address.zipcode}`.trim()
=======
	address: {
		street: {type: String, required: true},
		coord: {
			lat: Number,
			lng: Number
		},
	},
	zipcode: {type: String, required: true}
});

bathroomSchema.virtual('addressString').get(function() {
	return `${this.address.street}`.trim()
>>>>>>> feature/tests
});

bathroomSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		type: this.type,
		city: this.city,
		name: this.name,
<<<<<<< HEAD
		hours: this.hours,
		address: this.addressString
=======
		address: this.address.street,
		coord: this.address.coord,
		zipcode: this.zipcode
>>>>>>> feature/tests
	};
}

const Bathroom = mongoose.model('Bathroom', bathroomSchema);

module.exports = {Bathroom};