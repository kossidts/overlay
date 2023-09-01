import "./style.css";
import { Overlay, $overlay } from "./components/Overlay";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div class="card">
        <h2>Modal</h2>
        <button id="overlay-modal" type="button">Open the Modal</button>
    </div>
    <div class="card">
        <h2>Toast</h2>

        <div class="grid">
            <button class="overlay-toast" type="button" data-position="toast-top toast-left">Toast message (top left)</button>
            <button class="overlay-toast" type="button" data-position="toast-top toast-center">Toast message (top center)</button>
            <button class="overlay-toast" type="button" data-position="toast-top toast-right">Toast message (top right)</button>
            <button class="overlay-toast" type="button" data-position="toast-center toast-left">Toast message (center left)</button>
            <button class="overlay-toast" type="button" data-position="toast-centered">Toast message (centered)</button>
            <button class="overlay-toast" type="button" data-position="toast-center toast-right">Toast message (center right)</button>
            <button class="overlay-toast" type="button" data-position="toast-bottom toast-left">Toast message (bottom left)</button>
            <button class="overlay-toast" type="button" data-position="toast-bottom toast-center">Toast message (bottom center)</button>
            <button class="overlay-toast" type="button" data-position="toast-bottom toast-right">Toast message (bottom right)</button>
        </div>
    </div>
  </div>
`;

const $overlayModal = document.querySelector("#overlay-modal")!;
$overlayModal.addEventListener("click", () => {
    const $modal = new Overlay({
        title: "This website uses cookies",
        content: `<p>We use cookies to make sure this website can function. 
        By continuing to browse on this website, you agree to our <a href="#">use of cookies.</a>
        </p>
        <p> 
          Cookies are small text files used by websites to provide a more efficient user experience. <br>
          This site uses different types of cookies. Some cookies are placed by third parties that appear on our sites.
        </p>
        <button class="btn">Continue to website</button>`,
    });

    $modal.on("click", event => {
        if ((<HTMLElement>event.target).closest(".btn")) {
            $modal.close();
        }
    });
});

const $overlayToasts = document.querySelectorAll(".overlay-toast")!;
for (const $overlayToast of $overlayToasts) {
    const classes: string[] = (<HTMLElement>$overlayToast).dataset.position?.split(" ")!;
    $overlayToast.addEventListener("click", () => {
        const classList = ["toast"].concat(classes);
        $overlay({
            classList: classList,
            dismissible: false,
            autoCloseAfter: 1500, // ms
            title: "Settings successfully updated.",
        });
    });
}
