const CACHE_NAME = "fe-stage-practice-v135";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v135",
  "./improvement-questions.js?v135",
  "./subject-b-case-questions.js?v135",
  "./subject-b-case-questions-2.js?v135",
  "./question-choice-sets.js?v135",
  "./sample-derived-questions.js?v135",
  "./app.js?v135",
  "./manifest.webmanifest",
  "./assets/branch-evolution-sheet.png",
  "./assets/creature-amphibian.png",
  "./assets/creature-fish.png",
  "./assets/creature-human.png",
  "./assets/creature-mammal.png",
  "./assets/creature-primate.png",
  "./assets/creature-proto.png",
  "./assets/creature-reptile.png",
  "./assets/evolution-sprite.png",
  "./assets/final-evolutions-sheet.png",
  "./assets/branches/branch-algorithm-human.png",
  "./assets/branches/branch-algorithm-mammal.png",
  "./assets/branches/branch-algorithm-primate.png",
  "./assets/branches/branch-algorithm-reptile.png",
  "./assets/branches/branch-balanced-human.png",
  "./assets/branches/branch-balanced-mammal.png",
  "./assets/branches/branch-balanced-primate.png",
  "./assets/branches/branch-balanced-reptile.png",
  "./assets/branches/branch-database-human.png",
  "./assets/branches/branch-database-mammal.png",
  "./assets/branches/branch-database-primate.png",
  "./assets/branches/branch-database-reptile.png",
  "./assets/branches/branch-management-human.png",
  "./assets/branches/branch-management-mammal.png",
  "./assets/branches/branch-management-primate.png",
  "./assets/branches/branch-management-reptile.png",
  "./assets/branches/branch-strategy-human.png",
  "./assets/branches/branch-strategy-mammal.png",
  "./assets/branches/branch-strategy-primate.png",
  "./assets/branches/branch-strategy-reptile.png",
  "./assets/branches/branch-technology-human.png",
  "./assets/branches/branch-technology-mammal.png",
  "./assets/branches/branch-technology-primate.png",
  "./assets/branches/branch-technology-reptile.png",
  "./assets/finals/final-algorithm-female.png",
  "./assets/finals/final-algorithm-male.png",
  "./assets/finals/final-balanced-female.png",
  "./assets/finals/final-balanced-male.png",
  "./assets/finals/final-database-female.png",
  "./assets/finals/final-database-male.png",
  "./assets/finals/final-god.png",
  "./assets/finals/final-management-female.png",
  "./assets/finals/final-management-male.png",
  "./assets/finals/final-strategy-female.png",
  "./assets/finals/final-strategy-male.png",
  "./assets/finals/final-technology-female.png",
  "./assets/finals/final-technology-male.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
