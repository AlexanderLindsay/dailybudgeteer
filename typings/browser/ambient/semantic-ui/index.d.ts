interface JQuery {
    form(formDefinition: any, options: any): any;
    dropdown(input: { on: string }): void;
    transition(name: string, duration: number, callback?: () => void): any;
    sticky(options: { context: string }): any;
    search(options: Object): any;
    modal(text: string): any;
    modal(options: Object): any;
}