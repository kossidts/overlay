import "./styles.scss";

interface OverlayProps {
    // title?: string | HTMLElement;
    // content?: string | HTMLElement;
    // footer?: string | HTMLElement;
    title?: string;
    content?: string;
    footer?: string;
    classList?: string[] | string;
    dismissible?: boolean;
    size?: string;
    autoCloseAfter?: number;
}

type OverlayEventName = keyof GlobalEventHandlersEventMap | "ready" | "close";

export class Overlay {
    options: OverlayProps = {
        title: "",
        content: "",
        footer: "",
        classList: [],
        dismissible: true,
        autoCloseAfter: -1,
        // size: "small",
    };
    eventQueue = new Map();
    eventsNames!: OverlayEventName[];
    overlay!: HTMLElement;

    constructor(options: OverlayProps = {}) {
        // add default title / content?
        // this.options = Object.assign({}, this.options, options); // as Props;
        this.options.title = "";
        // Unless not set, ensure the 'title' property is either a string or an HTMLElement
        if (typeof options.title === "string" && options.title.trim().length) {
            this.options.title = options.title.trim();
            // } else if (options.title && options.title instanceof HTMLElement) {
            //?? this.options.title = options.title;
        } else if (options.title) {
            console.warn("The propery 'title' must be either a string or an HTMLElement");
        }

        // if(options.content instanceof DocumentFragment || options.content instanceof Element){}
        // Unless not set, ensure the 'content' property is either a string or an HTMLElement
        if (typeof options.content === "string" && options.content.trim().length) {
            this.options.content = options.content.trim();
            // } else if (options.content && options.content instanceof HTMLElement) {
            //??
        } else if (options.content) {
            console.warn("The propery 'content' must be either a string or an HTMLElement");
        }

        // Unless not set, ensure the 'footer' property is either a string or an HTMLElement
        if (typeof options.footer === "string" && options.footer.trim().length) {
            this.options.footer = options.footer.trim();
            // } else if (options.footer && options.footer instanceof HTMLElement) {
            //??
        } else if (options.footer) {
            console.warn("The propery 'footer' must be either a string or an HTMLElement");
        }

        // Unless not set, ensure the 'classList' property is either a string or an array
        if (typeof options.classList === "string") {
            // this.options.classList = this.options.classList.split(" ");
            this.options.classList = options.classList.split(/[\,|\s+]+/);
        } else if (Array.isArray(options.classList)) {
            this.options.classList = options.classList;
        } else {
            console.warn("The propery 'classList' must be either a string or an Array");
            this.options.classList = [];
        }

        this.options.dismissible = options.dismissible !== false;

        if (options.autoCloseAfter && +options.autoCloseAfter > 0) {
            this.options.autoCloseAfter = +options.autoCloseAfter;
        }

        // if (typeof this.options.size === "string") {
        //     this.options.classList.push(`size-${options.size}`);
        // }

        this.createOverlay();
        this.launch();
        // return this;
    }

    /**
     * Create the overlay
     *
     * @returns void
     */
    createOverlay() {
        this.overlay = document?.createElement("div");
        if (!(this.overlay instanceof HTMLElement)) {
            return console.error("Missing the document object.");
        }
        const $container = document.createElement("div");

        let template = "";

        // if (this.options.title && this.options.title.trim().length > 0) {
        if (this.options.title && this.options.title.trim().length) {
            template += `<h3 class="overlay-title">${this.options.title}</h3>`;
        }

        template += `<div class="overlay-body">${this.options.content}</div>`;

        if (this.options.footer && this.options.footer.trim().length) {
            template += `<div class="overlay-footer">${this.options.footer}</div>`;
        }

        if (this.options.dismissible) {
            // let $closeBtnIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // $closeBtnIconPath.setAttribute(
            //     "d",
            //     "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            // );

            // let $closeBtnIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            // $closeBtnIcon.setAttribute("fill", "currentColor");
            // $closeBtnIcon.setAttribute("viewBox", "0 0 16 16");
            // $closeBtnIcon.appendChild($closeBtnIconPath);

            // let $closeBtn = document.createElement("button");
            // $closeBtn.classList.add("btn", "close-overlay");
            // $closeBtn.appendChild($closeBtnIcon);
            // $closeBtn.addEventListener("click", e => this.close());

            // this.overlay.appendChild($closeBtn);
            template += `<button class="btn dismiss-overlay" type="button" aria-label="Close">
            <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
            </svg>
            </button>`;
        }

        $container.innerHTML = template;
        $container.className = "overlay-container";
        this.overlay.className = "overlay";
        // this.overlay.setAttribute('role', 'alert');
        // this.overlay.setAttribute('aria-hidden', true);
        this.overlay.append($container);
    }

    /**
     * Mount the overlay to the DOM, add classes and set up core events:
     *  - close the overlay on escape keydown
     *  - close the overlay on close button click
     *
     * @returns void
     */
    launch() {
        document.body.appendChild(this.overlay);
        this.overlay.setAttribute("tabindex", "0");
        this.overlay.classList.add("overlay-open", ...(this.options.classList as string[]));
        this.overlay.focus();
        this.on("click", (event: Event) => {
            // if (event.target instanceof HTMLElement && event.target.closest(".dismiss-overlay")) {
            if (event.target instanceof Element && event.target.closest(".dismiss-overlay")) {
                this.close();
            }
        });
        // if escape-to-close
        this.on("keydown", (event: Event) => {
            // console.log("keydown", event);
            if (event instanceof KeyboardEvent && event.key == "Escape") {
                this.close();
            }
        });

        // this.overlay.addEventListener("animationend", () => {
        //     this.overlay.classList.remove("move-in");
        // });
        // this.overlay.addEventListener("animationcancel", () => {
        //     this.overlay.classList.remove("move-in");
        // });

        // this.overlay.classList.add("move-in");

        if (this.options.autoCloseAfter && this.options.autoCloseAfter > 0) {
            setTimeout(() => {
                this.close();
            }, this.options.autoCloseAfter);
        }
    }

    /**
     * Register events to be call later at the right time
     *
     * @param eventName string Name of the event: 'close', 'ready' or any event that can be registered via addEventListener
     * @param callback function A callable function to invoke when the event occurs
     * @returns void
     */
    on(eventName: "ready" | "close", callback: (overlay: HTMLElement) => void): void;
    on(eventName: keyof GlobalEventHandlersEventMap, callback: (event: Event) => void): void;
    on(eventName: OverlayEventName, callback: ((event: Event) => void) | ((overlay: HTMLElement) => void)): void {
        if (typeof eventName !== "string") {
            return console.warn(`The name of the event must one a string`);
        }
        if (typeof callback !== "function") {
            return console.warn("Please provide an event callback function.");
        }

        // invoke the on ready callback right away
        if (eventName == "ready") {
            return callback(this.overlay as any);
        }
        const eventCallbacks = this.eventQueue.get(eventName) || [];
        eventCallbacks.push(callback);
        this.eventQueue.set(eventName, eventCallbacks);
        if (eventName !== "close") {
            this.overlay.addEventListener(eventName, callback as any);
        }
        // return this;
    }

    // Add event delegation with signatur on(eventName, targetSelector, callback)

    /**
     * Clean up, remove event listeners and call/envoke on("close") callbacks
     * the delete the overlay element.
     *
     * @returns void
     */
    close() {
        for (const [eventName, eventCallbacks] of this.eventQueue) {
            // console.log(eventName);
            // console.log(eventCallbacks);
            if (eventName !== "close" && eventName !== "ready") {
                this.overlay.removeEventListener(eventName, eventCallbacks);
            }

            if (eventName == "close") {
                // call the functions immediately
                for (const callback of eventCallbacks) {
                    callback(this.overlay);
                }
            }
        }

        // if ( this.focusedElBeforeOpen ) {
        //     this.focusedElBeforeOpen.focus();
        // }

        this.overlay.remove();
    }

    // auto init: selector [data-trigger-overlay]
}

// Wrapped into a function call
export const $overlay = (options: OverlayProps) => new Overlay(options);
