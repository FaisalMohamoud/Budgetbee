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
            .addEventListener("click", ctrlAddItem);
        //Keyboard Event
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    return {
      
    }
})(dataController, UIController);

