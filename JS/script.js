const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 100) {

        header.style.position = "fixed";
        header.style.background = "rgba(5, 5, 5, 0.92)";
        header.style.backdropFilter = "blur(12px)";
        header.style.webkitBackdropFilter = "blur(12px)";

    } else {

        header.style.position = "absolute";
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.webkitBackdropFilter = "none";

    }

});
