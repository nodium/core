(function (context, _, undefined) {

'use strict';

var transformer = context.setNamespace('app.transformer'),
    app         = context.use('app'),
    _defaults   = {
    	map: {} // the non property values
    };

transformer.AbstractDataTransformer = app.createClass({

	construct: function (options) {

		this.options = _.extend({}, _defaults, options);
	},

	from: function () {
		throw 'The data transformer should implement a "from" function';
	},

	to: function () {
		throw 'The data transformer should implement a "to" function';
	},

	getMappedProperties: function (data) {
		return this.filterAndChangePropertyKeys(data, this.options.map);
	},

	/**
     * Returns an object with the database field linked to the data value
     */
    filterAndChangePropertyKeys: function (data, obj) {

        var mapped = {},
            dataField,
            mappedField,
            value;

        for (mappedField in obj) {

        	if (!obj.hasOwnProperty(mappedField)) {
        		continue;
        	}

            dataField = obj[mappedField];
            value = data[dataField];

            if (!value) {
                continue;
            }

            mapped[mappedField] = value;
        }

        return mapped;
    },

    /**
     * Splits the data object into two objects
     *   properties: an object with the direct key/value pairs from data
     *   mapped: an object with the keys as values from the map
     *
     * @param {Object} data The data object to be split
     * @param {Object} map The mapping object
     *                 mapping to false means excluding a key
     */
    splitProperties: function (data, map) {

        var properties = {},
            mapped = {};

        _.forOwn(data, function (value, key) {
            if (map.hasOwnProperty(key) && map[key]) {
                mapped[map[key]] = value;
            } else {
                properties[key] = value;
            }
        });

        return {
            properties: properties,
            mapped: mapped
        };
    }
});

}(this, _));