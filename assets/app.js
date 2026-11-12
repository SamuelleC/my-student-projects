const PROJECTS = [
    {
        slug: "menty",
        title: "Menty",
        description: "My senior high school thesis: a stress and anxiety chatbot website with a blog, services page, and a 24/7 support chatbot.",
        path: "projects/Menty/home.html",
        tags: ["Thesis", "HTML", "CSS", "JavaScript"],
    },
    {
        slug: "dice-roller",
        title: "Dice Roller",
        description: "Roll any number of D4 to D20 dice at once and see each result laid out individually.",
        path: "projects/Dice-Roller/JS_Dice.html",
        tags: ["HTML", "CSS", "JavaScript"],
    },
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
const viewerExternal = viewer.querySelector("[data-viewer-external]");
const viewerClose = viewer.querySelector("[data-viewer-close]");
let viewerFrame = viewer.querySelector("[data-viewer-frame]");

const LAUNCHER_TITLE = document.title;

let activeProject = null;

const previewObserver = new ResizeObserver((entries) => {
    for (const { target, contentRect } of entries) {
        const frame = target.querySelector("[data-card-frame]");
        frame.style.transform = `scale(${contentRect.width / PREVIEW_WIDTH})`;
    }
});

function renderCard(project, index) {
    const card = cardTemplate.content.cloneNode(true);

    const link = card.querySelector("[data-card-link]");
    link.href = `#/${project.slug}`;
    link.textContent = project.title;
    card.querySelector("[data-card-index]").textContent = String(index + 1).padStart(2, "0");
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

// A fresh iframe per project fully unloads the previous one and keeps the
// pages browsed inside it out of the launcher's own history.
function replaceViewerFrame(project) {
    const frame = viewerFrame.cloneNode(false);
    frame.removeAttribute("src");
    if (project) {
        frame.src = project.path;
        frame.title = project.title;
    }
    viewerFrame.replaceWith(frame);
    viewerFrame = frame;
}

function openViewer(project) {
    if (project === activeProject) return;
    activeProject = project;

    replaceViewerFrame(project);
    viewerTitle.textContent = project.title;
    viewerExternal.href = project.path;
    document.title = `${project.title} · ${LAUNCHER_TITLE}`;

    viewer.classList.replace("hidden", "flex");
    launcher.inert = true;
    document.body.classList.add("overflow-hidden");
    viewerClose.focus();
}

function closeViewer() {
    if (!activeProject) return;
    const { slug } = activeProject;
    activeProject = null;

    replaceViewerFrame(null);
    document.title = LAUNCHER_TITLE;

    viewer.classList.replace("flex", "hidden");
    launcher.inert = false;
    document.body.classList.remove("overflow-hidden");
    list.querySelector(`[href="#/${slug}"]`)?.focus();
}

function route() {
    const slug = location.hash.replace(/^#\/?/, "");
    const project = PROJECTS.find((item) => item.slug === slug);
    project ? openViewer(project) : closeViewer();
}

function showLauncher() {
    history.replaceState(null, "", location.pathname + location.search);
    closeViewer();
}

list.append(...PROJECTS.map(renderCard));
document.querySelector("[data-year]").textContent = new Date().getFullYear();

viewerClose.addEventListener("click", showLauncher);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeProject) showLauncher();
});

window.addEventListener("hashchange", route);

route();
