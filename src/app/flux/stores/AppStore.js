var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');
//var AppServices = require('../services/AppServices');

var results_well = {
	limit: 10,
	page_num: 0,
	list: [],
	getNextList: function(item) {
		
		this.getList(this.limit, this.page_num).then(function(result) {
			
			result.forEach(function(obj) {
				results_well.list[results_well.list.length] = obj;
			});

			console.log('results_well.page_num: ' + results_well.page_num)

			results_well.page_num = results_well.page_num + 1;

			AppStore.emitChange();

		});

	},
 	getList: function(limit, page_num) {
		/*
		return new Promise(function(resolve, reject) {

			AppServices.getList(limit, page_num).then(function(result) {
				
				resolve(result)

			}).catch(function(err) {

				reject(err);

			});

		});*/

	}
}

var CHANGE_EVENT = 'change';

var AppStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on('change', callback)
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback)
	},
	results_well: results_well
});

AppDispatcher.register(function(payload){
  console.log(payload);

  // app event switch statement here

  switch (payload.action.actionType) {
	case AppConstants.GET_NEXT_LIST:

		AppStore.results_well.getNextList(payload.action.item)

	break;

	case AppConstants.REMOVE_HAIRPIQ:

	break;

}

  return true;
});

module.exports = AppStore;
