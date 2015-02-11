/**
 * This file is part of the Nodium core package
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
(function (context, $, undefined) {

    'use strict';

    var api         = context.setNamespace('app.api'),
        app         = context.use('app'),
        model       = context.use('app.model'),
        NodeEvent   = context.use('app.event.NodeEvent'),
        EdgeEvent   = context.use('app.event.EdgeEvent');

    /**
     * Binds kernel events to api calls
     * @constructor
     */
    api.APIConsumer = app.createClass({

        construct: function (api) {

            this.api = api;
        },

        initialize: function () {

            // This should be done dynamically depending on which functionality the given api exposes
            $(this.kernel).on(NodeEvent.CREATED, this.handleNodeCreated.bind(this));
            $(this.kernel).on(NodeEvent.DESTROYED, this.handleNodeDeleted.bind(this));
            $(this.kernel).on(EdgeEvent.CREATED, this.handleEdgeCreated.bind(this));
            $(this.kernel).on(EdgeEvent.DESTROYED, this.handleEdgeDeleted.bind(this));
            $(this.kernel).on(NodeEvent.UPDATED, this.handleNodeUpdated.bind(this));
            $(this.kernel).on(NodeEvent.UPDATED, this.handleNodeLabelUpdated.bind(this));
        },

        executeIfExists: function (functionName) {

            var args,
                fn;

            fn = this.api[functionName];

            if ('function' !== typeof fn) {
                return;
            }

            args = arguments.slice(1);

            return fn.apply(this.api, args);
        }

        /**
         * Gets the normalized api content
         * @param {Function} callback
         */
        get: function (callback) {

            this.executeIfExists('getGraph').then(callback);
        },

        /**
         * Triggered by NodeEvent.CREATED
         * @param {Object} event
         * @param {Node} node
         * @param {Object} data
         */
        handleNodeCreated: function (event, node, data) {

            this.executeIfExists('createNode', data);
        },

        /**
         * Triggered by NodeEvent.DELETED
         * @param {Object} event
         * @param {Object} data
         */
        handleNodeDeleted: function (event, data) {

            this.executeIfExists('deleteNode', data);
        },

        /**
         * Triggered by EdgeEvent.CREATED
         * @param {Object} event
         * @param {Object} data
         * @param {Object} source
         * @param {target} target
         */
        handleEdgeCreated: function (event, data, source, target) {

            this.executeIfExists('createEdge', {
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

            this.executeIfExists('deleteEdge', { id: data.id });
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

            this.executeIfExists('updateNode', data);
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

            this.executeIfExists('updateNodeLabels', data);
        }
    });

}(this, jQuery));
