/// <reference path="rate.ts" />

module Rates {
    "use strict";
    
    export class ListRates {
        
        public activeRates: Rate[];
        
        constructor() {
            this.activeRates = [];
            this.activeRates.push(new Rate("Test", -430, 30));
        }
    }   
}