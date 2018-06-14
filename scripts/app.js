"user-strict";

//DATA CONTROLLER
let dataController = (function () { })();

// UI CONTROLLER
let UIController = (function () {
    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addbtn: ".add__btn"
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
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
        document.querySelector(DOMElements.addbtn).addEventListener("click", ctrlAddItem);
        //Keyboard Event
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

   //Controll the added Items.
    let ctrlAddItem = function () { 
       
        // 1. Get user input.
        let input = UICtrl.getInput();

      

    };

    return {
        init: function () {
            console.log("Application has started.");
            setupEventListeners();
        }
    };
})(dataController, UIController);

AppController.init();
