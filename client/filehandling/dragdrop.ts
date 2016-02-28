export class FileHandlerOptions {
    constructor(public onchange?: (files: FileList) => void) { }
}

export class FileHandler {
    constructor(public element: HTMLElement, private options: FileHandlerOptions) {
        element.addEventListener("dragenter", this.activate);
        element.addEventListener("dragover", this.activate);
        element.addEventListener("dragleave", this.deactivate);
        element.addEventListener("dragend", this.deactivate);
        element.addEventListener("drop", this.deactivate);
        element.addEventListener("drop", this.update);
    }

    private activate = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    private deactivate = (e: DragEvent) => {

    };

    private update = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.options.onchange != null) {
            this.options.onchange(e.dataTransfer.files);
        }
        return false;
    };
}
