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
		},
		total: {
			inc: 0,
			exp: 0
		},
		availableBudget: 0,
		expPercentage: -1,

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
			data.expPercentage = Math.round((data.total.exp / data.total.inc) * 100);
		} else {
			data.expPercentage = -1;
		}

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

			// Calculate Total
			calculateBudget(type);
			return item;
		},

		getBudget: function () {
			return {
				totalIncome: data.total.inc,
				totalExpenses: data.total.exp,
				budget: data.availableBudget,
				percentage: data.expPercentage
			}
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
		addbtn: '.add__btn',
		incomeList: '.income__list',
		expensesList: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage'
	};
	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
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
				HTML = `<div class="item clearfix" id="%id%">
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
				HTML = `<div class="item clearfix" id="%id%">
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
			newHTML = newHTML.replace('%value%', obj.value);

			// Insert the HTML into the DOM.
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

		},

		clearFields: () => {
			// Clear Fields.
			document.querySelector(DOMStrings.inputDescription).value = '';
			document.querySelector(DOMStrings.inputValue).value = '';

			// Set focus back to the description field.
			document.querySelector(DOMStrings.inputDescription).focus();
		},

		displayBudget: function (obj) {

			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
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

	let updateUI = function () {
		let budget;

		// 1. Get Budget
		budget = dataCtrl.getBudget();

		//2. Update UI.
		UICtrl.displayBudget(budget);


	};

	return {
		init: function () {
			console.log('Application has started.');
			setupEventListeners();
			UICtrl.displayBudget({
				totalIncome: 0,
				totalExpenses: 0,
				budget: 0,
				percentage: -1
			})
		}
	};
})(dataController, UIController);

AppController.init();
