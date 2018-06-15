'user-strict';

//DATA CONTROLLER
let dataController = (function () {
	//Constructors
	let Income = function (id, desc, value) {
		this.id = id;
		this.description = desc;
		this.value = value;
	};
	let Expenses = function (id, desc, value) {
		this.id = id;
		this.description = desc;
		this.value = value;
	};

	//Data Structure
	let data = {
		records: {
			inc: [],
			exp: []
		}
	};

	return {
		//Add Items to the Ds.
		addItem: function (type, desc, val) {
			let record, ID, item;

			// 1. Create an ID for the item
			if (data.records[type].length === 0) {
				ID = 1;
			} else {
				// Get the previous Id and add 1 to create new id.
				ID = data.records[type][data.records[type].length - 1].id + 1;
			}

			// 2. Create new Item from the Constructors..
			if (type === 'inc') {
				item = new Income(type, desc, val);
			} else if (type === 'exp') {
				item = new Expenses(type, desc, val);
			}

			// 3. Add the newly created Item to the Ds.
			data.records[type].push(item);
		},

		test: {
			data: data
		}
	};
})();

// UI CONTROLLER
let UIController = (function () {
	let DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		addbtn: '.add__btn'
	};
	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription)
					.value,
				value: parseFloat(
					document.querySelector(DOMStrings.inputValue).value
				)
			};
		},

		clearFields: () => {
			// Clear Fields.
			document.querySelector(DOMStrings.inputDescription).value = '';
			document.querySelector(DOMStrings.inputValue).value = '';

			// Set focus back to the description field.
			document.querySelector(DOMStrings.inputDescription).focus();

		},

		getDOMStrings: function () {
			return DOMStrings;
		}
	};
})();

// APP CONTROLLER
let AppController = (function (dataCtrl, UICtrl) {

	//Event handler
	let setupEventListeners = function () {
		let DOMElements = UICtrl.getDOMStrings();
		//Mouse Event
		document
			.querySelector(DOMElements.addbtn)
			.addEventListener('click', ctrlAddItem);
		//Keyboard Event
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});
	};
	//Controll the added Items.
	let ctrlAddItem = function () {
		let input, newItem;

		// 1. Get user input.
		input = UICtrl.getInput();

		if (
			!isNaN(input.value) &&
			input.value !== '' &&
			input.description !== ''
		) {
			// 2. Add new item to the data structure.
			newItem = dataCtrl.addItem(
				input.type,
				input.description,
				input.value
			);

			// 2. Add new item to the UI.

			// 3. Clear Input Fields.
			UICtrl.clearFields();

			//4.UPDATE UI.
		}
	};

	return {
		init: function () {
			console.log('Application has started.');
			setupEventListeners();
		}
	};
})(dataController, UIController);

AppController.init();
