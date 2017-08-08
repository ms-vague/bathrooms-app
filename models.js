const mongoose = require('mongoose');

const bathroomSchema = mongoose.Schema({
	type: {type: String, required: true},
	city: {type: String, required: true},
	name: {type: String, required: true},
	hours: {type: String, required: true},
	address: {
		coord: {
			lat: Number,
			lng: Number
		},
		street: String,
		zipcode: String
	}
});

bathroomSchema.virtual('addressString').get(function() {
	return  `${this.address.street} ${this.address.zipcode}`.trim()
});

bathroomSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		type: this.type,
		city: this.city,
		name: this.name,
		hours: this.hours,
		address: this.addressString,
		coords: { 
			lat: this.address.coord.lat,
			lng: this.address.coord.lng
		 }
	};
}

const Bathroom = mongoose.model('Bathroom', bathroomSchema);

module.exports = {Bathroom};