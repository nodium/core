/**
 * This file is part of the Nodium Neo4j package
 *
 * (c) Niko van Meurs & Sid Mijnders
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Niko van Meurs <nikovanmeurs@gmail.com>
 * @author Sid Mijnders
 */
module.exports = function (Nodium, $, undefined) {

    'use strict';

    var graph       = Nodium.graph,
        model       = Nodium.model,
        NodeEvent   = Nodium.event.NodeEvent,
        EdgeEvent   = Nodium.event.EdgeEvent;

    /**
     * Binds kernel events to api calls
     * @constructor
     */
    graph.Neo4jAPI = Nodium.createClass({

        construct: function (api) {

            this.api = api;
        },

        initialize: function () {
            $(this.kernel).on(NodeEvent.CREATED, this.handleNodeCreated.bind(this));
            $(this.kernel).on(NodeEvent.DESTROYED, this.handleNodeDeleted.bind(this));
            $(this.kernel).on(EdgeEvent.CREATED, this.handleEdgeCreated.bind(this));
            $(this.kernel).on(EdgeEvent.DESTROYED, this.handleEdgeDeleted.bind(this));
            $(this.kernel).on(NodeEvent.UPDATED, this.handleNodeUpdated.bind(this));
            $(this.kernel).on(NodeEvent.UPDATED, this.handleNodeLabelUpdated.bind(this));
        },

        /**
         * Gets the normalized graph content
         * @param {Function} callback
         */
        get: function (callback) {

            this.api.getGraph().then(callback);
        },

        /**
         * Triggered by NodeEvent.CREATED
         * @param {Object} event
         * @param {Node} node
         * @param {Object} data
         */
        handleNodeCreated: function (event, node, data) {

            this.api.createNode(data);
        },

        /**
         * Triggered by NodeEvent.DELETED
         * @param {Object} event
         * @param {Object} data
         */
        handleNodeDeleted: function (event, data) {

            this.api.deleteNode(data);
        },

        /**
         * Triggered by EdgeEvent.CREATED
         * @param {Object} event
         * @param {Object} data
         * @param {Object} source
         * @param {target} target
         */
        handleEdgeCreated: function (event, data, source, target) {

            this.api.createEdge({
                from: source,
                to:   target
            }).then(function (id) {
                data._id = id;
            });
        },

        /**
         * Triggered by EdgeEvent.DELETED
         * @param {Object} event
         * @param {Object} data
         */
        handleEdgeDeleted: function (event, data) {

            this.api.deleteEdge({ id: data.id });
        },

        /**
         * Triggered by NodeEvent.UPDATED
         * @param {Object} event
         * @param {Node} node
         * @param {Object} data
         * @param {Update} update
         */
        handleNodeUpdated: function (event, node, data, update) {

            // check if a property was updated
            if (!update.changed(model.Node.getPropertiesPath()) &&
                !update.changed('_style')) {
                
                return;
            }

            console.log("api: handling node update");
            console.log(data._id);

            this.api.updateNode(data);
        },

        /**
         * Triggered by NodeEvent.UPDATEDLABEL
         * @param {Object} event
         * @param {Node} node
         * @param {Object} data
         * @param {Update} update
         */
        handleNodeLabelUpdated: function (event, node, data, update) {

            // check if a label was added or removed
            if (!update.changed(model.Node.getLabelsPath())) {
                return;
            }

            console.log("api: handling node label update");
            console.log(data._id);

            this.api.updateNodeLabels(data);
        }
    });
};
