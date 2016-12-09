var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {
	results_well: {
		getNextList: function(item) {
			AppDispatcher.handleViewAction({
			  actionType: AppConstants.GET_NEXT_LIST,
			  item: item
			})
		}
	},
	addItem: function(item){
		AppDispatcher.handleViewAction({
		  actionType:AppConstants.ADD_ITEM,
		  item: item
		})
	}
}

module.exports = AppActions;