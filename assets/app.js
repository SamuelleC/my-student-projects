const PROJECTS = [
    {
        slug: "survey-form",
        title: "Survey Form",
        description: "A screen-time survey with text inputs, checkboxes, radio buttons, and a dropdown, all with native validation.",
        path: "projects/surveyForm/index.html",
        tags: ["HTML", "CSS", "Forms"],
    },
    {
        slug: "tribute-page",
        title: "Tribute Page",
        description: "A tribute to Marcus Aurelius, the Roman emperor and Stoic philosopher.",
        path: "projects/tributePage/index.html",
        tags: ["HTML", "CSS"],
    },
    {
        slug: "technical-documentation",
        title: "Technical Documentation",
        description: "An introductory Python guide with a fixed side navigation linking to each section.",
        path: "projects/techDoc/index.html",
        tags: ["HTML", "CSS", "Docs"],
    },
    {
        slug: "product-landing-page",
        title: "Product Landing Page",
        description: "A multi-page landing site for the Samsung Galaxy S24 Ultra with home, products, and contact pages.",
        path: "projects/productLanding/index.html",
        tags: ["HTML", "CSS", "Multi-page"],
    },
];

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 800;

const launcher = document.querySelector("[data-launcher]");
const list = document.querySelector("[data-project-list]");
const cardTemplate = document.querySelector("#project-card");

const viewer = document.querySelector("[data-viewer]");
const viewerTitle = viewer.querySelector("[data-viewer-title]");
const viewerFrame = viewer.querySelector("[data-viewer-frame]");
const viewerExternal = viewer.querySelector("[data-viewer-external]");
const viewerClose = viewer.querySelector("[data-viewer-close]");

let openedFromLauncher = false;
let lastFocusedCard = null;

const previewObserver = new ResizeObserver((entries) => {
    for (const { target, contentRect } of entries) {
        const frame = target.querySelector("[data-card-frame]");
        frame.style.transform = `scale(${contentRect.width / PREVIEW_WIDTH})`;
    }
});

function renderCard(project, index) {
    const card = cardTemplate.content.cloneNode(true);

    card.querySelector("[data-card-link]").href = `#/${project.slug}`;
    card.querySelector("[data-card-index]").textContent = String(index + 1).padStart(2, "0");
    card.querySelector("[data-card-title]").textContent = project.title;
    card.querySelector("[data-card-description]").textContent = project.description;

    const frame = card.querySelector("[data-card-frame]");
    frame.src = project.path;
    frame.title = `${project.title} preview`;
    frame.style.width = `${PREVIEW_WIDTH}px`;
    frame.style.height = `${PREVIEW_HEIGHT}px`;
    previewObserver.observe(card.querySelector("[data-card-preview]"));

    const tags = card.querySelector("[data-card-tags]");
    for (const tag of project.tags) {
        const item = document.createElement("li");
        item.className = "rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400";
        item.textContent = tag;
        tags.append(item);
    }

    return card;
}

function openViewer(project) {
    if (viewerFrame.getAttribute("src") !== project.path) {
        viewerFrame.src = project.path;
    }
    viewerFrame.title = project.title;
    viewerTitle.textContent = project.title;
    viewerExternal.href = project.path;
    document.title = `${project.title} · Student Projects`;

    viewer.classList.replace("hidden", "flex");
    launcher.inert = true;
    document.body.classList.add("overflow-hidden");
    viewerClose.focus();
}

function closeViewer() {
    viewer.classList.replace("flex", "hidden");
    launcher.inert = false;
    document.body.classList.remove("overflow-hidden");
    viewerFrame.removeAttribute("src");
    document.title = "Student Projects · Samuelle Celis";
    lastFocusedCard?.focus();
}

function currentProject() {
    const slug = location.hash.replace(/^#\/?/, "");
    return PROJECTS.find((project) => project.slug === slug);
}

function route() {
    const project = currentProject();
    project ? openViewer(project) : closeViewer();
}

function exitViewer() {
    if (openedFromLauncher) {
        history.back();
    } else {
        history.replaceState(null, "", location.pathname + location.search);
        route();
    }
}

list.append(...PROJECTS.map(renderCard));
document.querySelector("[data-year]").textContent = new Date().getFullYear();

list.addEventListener("click", (event) => {
    const link = event.target.closest("[data-card-link]");
    if (!link) return;
    openedFromLauncher = true;
    lastFocusedCard = link;
});

viewerClose.addEventListener("click", exitViewer);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && currentProject()) exitViewer();
});

window.addEventListener("hashchange", () => {
    if (!currentProject()) openedFromLauncher = false;
    route();
});

route();
