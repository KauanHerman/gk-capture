const header = document.querySelector(".header");
const progress = document.querySelector(".scroll-progress");

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");

const sections = document.querySelectorAll("main section[id]");
const reveals = document.querySelectorAll(".reveal");

const introSite = document.querySelector(".intro-site");
const cursorPremium = document.querySelector(".cursor-premium");


/* =========================================
   ABERTURA DA MARCA
========================================= */

const prefereMovimentoReduzido =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (introSite && !prefereMovimentoReduzido) {

    document.body.style.overflow = "hidden";

    window.setTimeout(() => {

        introSite.classList.add("sair");
        document.body.style.overflow = "";

    }, 1450);

}


/* =========================================
   CURSOR "VER" SOMENTE NAS FOTOGRAFIAS
========================================= */

const podeUsarCursor =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !prefereMovimentoReduzido;

if (cursorPremium && podeUsarCursor) {

    const cardsCursor =
        document.querySelectorAll(".foto-card");

    cardsCursor.forEach(card => {

        card.addEventListener("mouseenter", () => {

            cursorPremium.classList.add("mostrar");
            cursorPremium.querySelector("span").textContent = "VER";

        });

        card.addEventListener("mousemove", event => {

            const tamanho = 56;
            const metade = tamanho / 2;

            const cursorX = event.clientX - metade;
            const cursorY = event.clientY - metade;

            cursorPremium.style.transform =
                `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        });

        card.addEventListener("mouseleave", () => {

            cursorPremium.classList.remove("mostrar");

        });

    });

}

/* =========================================
   HEADER + BARRA DE PROGRESSO
========================================= */

function atualizarHeaderEProgresso() {

    const scrollY = window.scrollY;

    const alturaDocumento =
        document.documentElement.scrollHeight - window.innerHeight;

    const progressoAtual =
        alturaDocumento > 0
            ? (scrollY / alturaDocumento) * 100
            : 0;

    progress.style.width =
        `${Math.min(100, Math.max(0, progressoAtual))}%`;

    if (scrollY > 70) {

        header.classList.add("header-scrolled");

        header.style.position = "fixed";
        header.style.background = "rgba(5, 5, 5, 0.82)";
        header.style.backdropFilter = "blur(16px)";
        header.style.webkitBackdropFilter = "blur(16px)";
        header.style.borderBottom = "1px solid rgba(255,255,255,.07)";

    } else {

        header.classList.remove("header-scrolled");

        header.style.position = "absolute";
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.webkitBackdropFilter = "none";
        header.style.borderBottom = "1px solid transparent";

    }

}


/* =========================================
   MENU MOBILE
========================================= */

function fecharMenu() {

    menu.classList.remove("aberto");
    menuToggle.classList.remove("ativo");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "menu-aberto"
    );

}

menuToggle.addEventListener("click", () => {

    const aberto = menu.classList.toggle("aberto");

    menuToggle.classList.toggle(
        "ativo",
        aberto
    );

    menuToggle.setAttribute(
        "aria-expanded",
        String(aberto)
    );

    document.body.classList.toggle(
        "menu-aberto",
        aberto
    );

});

menuLinks.forEach(link => {
    link.addEventListener("click", fecharMenu);
});


/* =========================================
   ANIMAÇÕES AO ROLAR
========================================= */

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visivel");
                revealObserver.unobserve(entry.target);

            });

        },

        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }

    );

reveals.forEach((elemento, index) => {

    elemento.style.transitionDelay =
        `${Math.min(index % 4, 3) * 70}ms`;

    revealObserver.observe(elemento);

});


/* =========================================
   MENU ATIVO POR SEÇÃO
========================================= */

const sectionObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                menuLinks.forEach(link => {

                    link.classList.toggle(
                        "ativo",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );

                });

            });

        },

        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }

    );

sections.forEach(section => sectionObserver.observe(section));


/* =========================================
   FILTROS DO PORTFÓLIO
========================================= */

const filtros = document.querySelectorAll(".filtro-btn");
const cards = [...document.querySelectorAll(".foto-card")];

function aplicarFiltro(filtro) {

    cards.forEach(card => {

        const categoria = card.dataset.category;

        const deveMostrar =
            filtro === "todos"
            || categoria === filtro;

        card.classList.toggle(
            "filtrado",
            !deveMostrar
        );

        if (deveMostrar) {

            card.classList.remove("animar-filtro");

            requestAnimationFrame(() => {
                card.classList.add("animar-filtro");
            });

        }

    });

}

filtros.forEach(botao => {

    botao.addEventListener("click", () => {

        filtros.forEach(item =>
            item.classList.remove("ativo")
        );

        botao.classList.add("ativo");

        aplicarFiltro(
            botao.dataset.filter
        );

    });

});


/* =========================================
   LIGHTBOX PREMIUM
========================================= */

const lightbox = document.querySelector(".lightbox");
const lightboxImagem = document.querySelector(".lightbox-imagem");
const lightboxTexto = document.querySelector(".lightbox-texto");
const lightboxCategoria = document.querySelector(".lightbox-categoria");
const lightboxContador = document.querySelector(".lightbox-contador");
const lightboxBarra = document.querySelector(".lightbox-progresso i");

const lightboxFechar = document.querySelector(".lightbox-fechar");
const lightboxAnterior = document.querySelector(".lightbox-anterior");
const lightboxProxima = document.querySelector(".lightbox-proxima");

let indiceAtual = 0;

function cardsVisiveis() {

    return cards.filter(
        card => !card.classList.contains("filtrado")
    );

}

function mostrarImagem(indice) {

    const lista = cardsVisiveis();

    if (!lista.length) {
        return;
    }

    indiceAtual =
        (indice + lista.length) % lista.length;

    const card = lista[indiceAtual];

    const imagem = card.querySelector("img");
    const titulo = card.querySelector(".foto-overlay h3");
    const categoria = card.querySelector(".foto-overlay span");

    lightboxImagem.style.opacity = "0";
    lightboxImagem.style.transform = "scale(.985)";

    window.setTimeout(() => {

        lightboxImagem.src = imagem.src;
        lightboxImagem.alt = imagem.alt;

        lightboxTexto.textContent =
            titulo?.textContent.trim()
            || imagem.alt;

        lightboxCategoria.textContent =
            categoria?.textContent.trim()
            || "Portfólio";

        lightboxContador.textContent =
            `${String(indiceAtual + 1).padStart(2, "0")} / ${String(lista.length).padStart(2, "0")}`;

        lightboxBarra.style.width =
            `${((indiceAtual + 1) / lista.length) * 100}%`;

        lightboxImagem.style.transition =
            "opacity .3s ease, transform .45s cubic-bezier(.2,.8,.2,1)";

        lightboxImagem.style.opacity = "1";
        lightboxImagem.style.transform = "scale(1)";

    }, 120);

}

function abrirLightbox(card) {

    const lista = cardsVisiveis();
    const indice = lista.indexOf(card);

    mostrarImagem(indice < 0 ? 0 : indice);

    lightbox.classList.add("aberto");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "lightbox-aberto"
    );

    lightboxFechar.focus();

}

function fecharLightbox() {

    lightbox.classList.remove("aberto");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "lightbox-aberto"
    );

}

cards.forEach(card => {

    card.addEventListener("click", () => {
        abrirLightbox(card);
    });

    card.addEventListener("keydown", event => {

        if (
            event.key === "Enter"
            || event.key === " "
        ) {

            event.preventDefault();
            abrirLightbox(card);

        }

    });

});

lightboxFechar.addEventListener(
    "click",
    fecharLightbox
);

lightboxAnterior.addEventListener(
    "click",
    () => mostrarImagem(indiceAtual - 1)
);

lightboxProxima.addEventListener(
    "click",
    () => mostrarImagem(indiceAtual + 1)
);

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        fecharLightbox();
    }

});

document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("aberto")) {
        return;
    }

    if (event.key === "Escape") {
        fecharLightbox();
    }

    if (event.key === "ArrowLeft") {
        mostrarImagem(indiceAtual - 1);
    }

    if (event.key === "ArrowRight") {
        mostrarImagem(indiceAtual + 1);
    }

});


/* =========================================
   EVENTOS GERAIS
========================================= */

window.addEventListener(
    "scroll",
    atualizarHeaderEProgresso,
    { passive: true }
);

window.addEventListener(
    "resize",
    atualizarHeaderEProgresso
);

atualizarHeaderEProgresso();

requestAnimationFrame(() => {

    document
        .querySelector(".hero-reveal")
        ?.classList.add("visivel");

});
