'use strict';

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
		this.percentage = -1;
	};

	Expenses.prototype.calPercentage = function (totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expenses.prototype.getPercentage = function () {
		return this.percentage;
	};

	//Data Structure
	let data = {
		records: {
			inc: [],
			exp: []
		},
		total: {
			inc: 0,
			exp: 0
		},
		availableBudget: 0,
		expPercentage: -1
	};

	let calculateBudget = function (type) {
		let sum;
		// 1. Calculate Totals.
		sum = 0;
		data.records[type].forEach(function (current) {
			sum += current.value;
		});
		data.total[type] = sum;

		// 2. Calculate budget.
		data.availableBudget = data.total.inc - data.total.exp;

		//3. Calculate Percentage of Income that is spent.
		if (data.total.inc > 0) {
			data.expPercentage = Math.round(
				(data.total.exp / data.total.inc) * 100
			);
		} else {
			data.expPercentage = -1;
		}
	};
	let calculatePercentage = function () {
		data.records.exp.forEach(function (c) {
			// each obj in exp invokes calPercentage.
			c.calPercentage(data.total.inc);
		});
	};

	return {
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
				item = new Income(ID, desc, val);
			} else if (type === 'exp') {
				item = new Expenses(ID, desc, val);
			}

			// 3. Add the newly created Item to the Ds.
			data.records[type].push(item);

			// Calculate budget.
			calculateBudget(type);
			return item;
		},
		deleteItem: function (type, id) {
			let allIds, index;

			// 1. Get all ids
			allIds = data.records[type].map(function (c) {
				return c.id;
			});

			// 2. get the index of the item to delete.
			index = allIds.indexOf(id);

			// 3. delete the item from the Data.
			if (index !== -1) {
				data.records[type].splice(index, 1);
			}

			// 4. Calculate budget.
			calculateBudget(type);
		},

		getItemPercentage: function () {
			// 1. Calculate.
			calculatePercentage();

			// 2. Get
			let allPercentage = data.records.exp.map(function (current) {
				return current.getPercentage();
			});

			return allPercentage;
		},
		getBudget: function () {
			return {
				totalIncome: data.total.inc,
				totalExpenses: data.total.exp,
				budget: data.availableBudget,
				percentage: data.expPercentage
			};
		},

		//TODO: Remove this after development.
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
		addBtn: '.add__btn',
		incomeList: '.income__list',
		expensesList: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		itemPercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
		itemContainer: '.container'
	};

	let formatNumber = function (num, type) {
		let numSplit, amount, decimal;

		num = Math.abs(num);
		// 1. Add 2 decimal points to the number.
		num = num.toFixed(2);

		numSplit = num.split('.');
		amount = numSplit[0];

		// 2. Format the amount.
		// Thousands.
		if (amount.length > 3 && amount.length <= 6) {
			amount =
				amount.substr(0, amount.length - 3) +
				',' +
				amount.substr(amount.length - 3, 3);
		} // Millions
		else if (amount.length > 6 && amount.length <= 9) {
			amount =
				amount.substr(0, amount.length - 6) +
				',' +
				amount.substr(amount.length - 6, 3) +
				',' +
				amount.substr(amount.length - 3, 3);
		} //Billions
		else if (amount.length > 9) {
			amount =
				amount.substr(0, amount.length - 9) +
				',' +
				amount.substr(amount.length - 9, 3) +
				',' +
				amount.substr(amount.length - 6, 3) +
				',' +
				amount.substr(amount.length - 3, 3);
		}

		decimal = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + amount + '.' + decimal;
	};

	// Custom forEach method for nodeLists.
	let nodeListForeach = function (list, callback) {
		for (let i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
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

		addItemList: function (obj, type) {
			let HTML, newHTML, element;

			// Create HTML string with some placeholders..
			if (type === 'inc') {
				element = DOMStrings.incomeList;
				HTML = `<div class="item clearfix" id="inc-%id%">
			 <div class="item__description">%description%</div>
			 <div class="right clearfix">
			  <div class="item__value">%value%</div>
			  <div class="item__delete">
					<button class="item__delete--btn">
						<i class="ion-ios-close-outline"></i>
					</button>
			  </div>
			 </div>
			</div>`;
			} else if (type === 'exp') {
				element = DOMStrings.expensesList;
				HTML = `<div class="item clearfix" id="exp-%id%">
				<div class="item__description">%description%</div>
				<div class="right clearfix">
					<div class="item__value">%value%</div>
					<div class="item__percentage">21%</div>
					<div class="item__delete">
						<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
					</div>
				</div>
			</div>`;
			}

			// Replace the placeholder text with some actual data text.
			newHTML = HTML.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM.
			document
				.querySelector(element)
				.insertAdjacentHTML('beforeend', newHTML);
		},

		deleteItemList: function(selectorId){
			let element = document.getElementById(selectorId);
			element.parentNode.removeChild(element);
		},

		clearFields: () => {
			// Clear Fields.
			document.querySelector(DOMStrings.inputDescription).value = '';
			document.querySelector(DOMStrings.inputValue).value = '';

			// Set focus back to the description field.
			document.querySelector(DOMStrings.inputDescription).focus();
		},

		displayBudget: function (obj) {
			let type;
			obj.budget > 0 ? (type = 'inc') : (type = 'exp');

			document.querySelector(
				DOMStrings.budgetLabel
			).textContent = formatNumber(obj.budget, type);
			document.querySelector(
				DOMStrings.incomeLabel
			).textContent = formatNumber(obj.totalIncome, 'inc');
			document.querySelector(
				DOMStrings.expensesLabel
			).textContent = formatNumber(obj.totalExpenses, 'exp');

			if (obj.percentage >= 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent =
					obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent =
					'---';
			}
		},

		displayPercentages: function (percentages) {
			let fields;

			fields = document.querySelectorAll(DOMStrings.itemPercentageLabel);
			nodeListForeach(fields, function (current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		displayDate: function () {
			let now, month, year, allMonths;

			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();

			allMonths = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'Decemeber'
			];

			document.querySelector(DOMStrings.dateLabel).textContent =
				allMonths[month] + ' ' + year;
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

		// 1. Add Event
		document.querySelector(DOMElements.addBtn)
			.addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});


		// 2. Delete Event.
		document.querySelector(DOMElements.itemContainer).addEventListener('click', ctrlDeleteItem);


	};
	//Controll the added Items.
	let ctrlAddItem = function () {
		let input, newItem;

		// 1. Get user input.
		input = UICtrl.getInput();

		if (
			!isNaN(input.value) &&
			input.value > 0 &&
			input.description !== ''
		) {
			// 2. Add new item to the data structure.
			newItem = dataCtrl.addItem(
				input.type,
				input.description,
				input.value
			);

			// 2. Add new item to the UI.
			UICtrl.addItemList(newItem, input.type);
			// 3. Clear Input Fields.
			UICtrl.clearFields();

			//4.UPDATE UI.
			updateUI();
		}
	};

	let ctrlDeleteItem = function (event) {
		let itemId, splitID, type, id;

		// 1. Find the Item Id.
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemId) {
			// 2.Get Item type and id.
			splitID = itemId.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);

			// 3. Delete from Ds.
			dataCtrl.deleteItem(type, id);

			// 4. delete from the UI.
			UICtrl.deleteItemList(itemId);
			
			//5. Update the UI.
			updateUI();
		}
	};

	let updateUI = function () {
		let budget, percentage;

		// 1. Get Budget
		budget = dataCtrl.getBudget();

		//2. Update UI with budget.
		UICtrl.displayBudget(budget);

		// 3. Read the item percentage.
		percentage = dataCtrl.getItemPercentage();

		// 4. Update the UI with item percentage.
		UICtrl.displayPercentages(percentage);
	};

	return {
		init: function () {
			console.log('Application has started.');
			setupEventListeners();
			UICtrl.displayDate();
			UICtrl.displayBudget({
				totalIncome: 0,
				totalExpenses: 0,
				budget: 0,
				percentage: -1
			});
		}
	};
})(dataController, UIController);

AppController.init();
