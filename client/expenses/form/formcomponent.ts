/// <reference path="formcontroller.ts" />
/// <reference path="formview" />

module ExpenseWidget {
    "use strict";
    
    export class FormComponent implements
        _mithril.MithrilComponent<FormController>{

        public controller: () => FormController;
        public view: _mithril.MithrilView<FormController>;

        constructor(onsave: ()=>void, expense: _mithril.MithrilProperty<Expense>) {
            this.controller = () => { return new FormController(onsave, expense); };
            this.view = formView;
        }
    }
}