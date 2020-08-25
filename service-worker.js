importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if(workbox){
  console.log("Workbox Loaded");
}
else {
  console.log("Worxbox Failed To Load");
}

workbox.precaching.precacheAndRoute([
  {url: "./index.html", revision: "1"},
  {url: "./nav.html", revision: "1"},
  {url: "./team-details.html", revision: "1"},
  {url: "./push.js", revision: "1"},
  {url: "./package-lock.json", revision: "1"},
  {url: "./pages/index-page.html", revision: "1"},
  {url: "./pages/favourite-team.html", revision: "1"},
  {url: "./css/materialize.min.css", revision: "1"},
  {url: "./js/api.js", revision: "1"},
  {url: "./js/db.js", revision: "1"},
  {url: "./js/helper.js", revision: "1"},
  {url: "./js/idb.js", revision: "1"},
  {url: "./js/materialize.min.js", revision: "1"},
  {url: "./js/script.js", revision: "1"},
  {url: "./assets/images/favicon.jpg", revision: "1"},
  {url: "./assets/images/icon-192x192.png", revision: "1"},
  {url: "./assets/images/icon-512x512.png", revision: "1"},
  {url: "./manifest.json", revision: "1"},
  {url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: "1"},
  {url: "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2", revision: "1"}
], {
ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp("/pages/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "pages"
  })
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({statuses: [0, 200]}),
      new workbox.expiration.ExpirationPlugin({maxAgeSeconds: 7 * 24 * 60 * 60, maxEntries: 30})
    ]
  })
)

// Configuring the payload for simulating push notification using Firebase
self.addEventListener("push", function(event){
  let body;
  if(event.data){
    body = event.data.text();
  }
  else {
    body = "No Payload";
  }
  const options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification("Football PWA Push Notification", options)
  );
});