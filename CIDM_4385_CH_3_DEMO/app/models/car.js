exports.definition = {
	config: {

		adapter: {
			type: "properties",
			collection_name: "car"
		}
	},
	
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			
		});

		return Model;
	},
	
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};