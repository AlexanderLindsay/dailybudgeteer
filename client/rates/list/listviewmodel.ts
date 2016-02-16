/// <reference path="../rate.ts" />

module RateWidget {
    "use strict";
    
    export class ListRates {
        
        public rates: Rate[];
        
        private edit: (index:number) => void;
        private remove: (index:number) => void;
        
        constructor(rates: Rate[], edit: (index:number) => void, remove: (index:number) => void) {
            this.rates = rates;
            this.edit = edit;
            this.remove = remove;
        }
        
        public editRate = (index: number) => {
            this.edit(index);
        }
        
        public removeRate = (index: number) => {
            this.remove(index);
        }
    }   
}