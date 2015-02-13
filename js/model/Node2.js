(function (context, _, undefined) {
	
	'use strict';

	var model  = context.setNamespace('app.model'),
		app    = context.use('app');
		
	/** fixed node properties
     *   id path          = '_id'
     *   labels path      = '_labels'
     *   properties path  = '_properties'
     *   mapped path      = '_mapped'
     */

	model.Node2 = app.createClass({

		construct: function (id, properties, mapped, labels, other) {

			// initialize the mandatory properties for Nodium
			this._id         = !id && id !== 0 ? _.uniqueId() : id;
			this._properties = properties || {};
			this._mapped     = mapped || {};
			this._labels     = labels || [];

			// add any other fields
			_.forOwn(other, function (value, key) {
				if (!this.hasOwnProperty(key)) {
					this[key] = value;
				} else {
					throw "node attribute conflict";
				}
			}, this);
		},

		addLabel: function (label) {

			if (!this.hasLabel(label)) {
				this._labels.push(label);
			}

			return this;
		},

		filterEdges: function (edges) {

            return edges.filter(function (edge) {
                var sourceId = edge.source.getId();
                var targetId = edge.target.getId();
                return sourceId === id || targetId === id;
            }, this);
        },

		getId: function () {
			return this._id;
		},

		getLabels: function () {
			return this._labels;
		},

		getProperties: function () {
			return this._properties;
		},

		getProperty: function (property) {
			return this._properties[property];
		},

		getMapped: function () {
			return this._mapped;
		},

		hasLabel: function (label) {
            return _.includes(this.getLabels(), label);
        },

		hasProperty: function (property) {
            return _.has(this.getProperties(), property);
        },

        hasPropertyWithValue: function (property, value) {
            return this.getProperty(property) === value;
        },

        removeLabel: function (label) {

        	return _.remove(this._labels, label);
        },

        /**
         * If value is set, only remove when it has the value
         * @param {String} property
         * @param {Any} value
         * @returns {Boolean}
         */
        removeProperty: function (property, value) {

        	if (value !== undefined && !this.hasPropertyWithValue(property, value)) {
        		return;
        	}

        	var propertyObject = _.pick(this._properties, property);

        	if (delete this._properties[property]) {
				return propertyObject;
			} else {
				return null;
			}
        },

        setLabels: function (labels) {

        	this._labels = labels;

        	return this;
        },

        setProperty: function (property, value) {

        	this._properties[property] = value;

        	return this;
        }
	});

})(this, _);