var assert        = require('assert'),
	chai          = require('chai'),
	expect        = chai.expect,
	should        = chai.should(),
	Nodium        = require('../js/nodium');

describe('Class creation', function () {
	describe('#super()', function () {
		it('should call a function down the prototype chain', function () {
			var class1 = Nodium.createClass({
				test: function () {
					console.log('test1');
					return 'class1';
				}
			});
			var class2 = Nodium.createClass(class1, {
				test: function () {
					console.log('test2');
					return this.super('test');
				}
			});
			var class3 = Nodium.createClass(class2, {
				test: function () {
					console.log('test3');
					return this.super('test');
				}
			});
			var class4 = Nodium.createClass(class3, {
				test: function () {
					console.log('test4');
					return this.super('test');
				}
			});

			var entity = new class4();

			assert.equal(entity.test(), 'class1');
		});
	});
});