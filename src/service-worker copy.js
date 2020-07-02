const CACHE_NAME = "premiere-league-v42";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./home.html",
  "./match.html",
  "./clubs.html",
  "./club-detail.html",
  "./favorite-clubs.html",
  "./saved-match.html",
  "./main.js",
  "./manifest.json",
  "./icons/android/mipmap-hdpi/ic_launcher.png",
  "./icons/android/mipmap-mdpi/ic_launcher.png",
  "./icons/android/mipmap-xhdpi/ic_launcher.png",
  "./icons/android/mipmap-xxhdpi/ic_launcher.png",
  "./icons/android/mipmap-xxxhdpi/ic_launcher.png",
  "./icons/AppIcon.appiconset/50.png",
  "./icons/AppIcon.appiconset/57.png",
  "./icons/AppIcon.appiconset/58.png",
  "./icons/AppIcon.appiconset/60.png",
  "./icons/AppIcon.appiconset/64.png",
  "./icons/AppIcon.appiconset/76.png",
  "./icons/AppIcon.appiconset/80.png",
  "./icons/AppIcon.appiconset/87.png",
  "./icons/AppIcon.appiconset/100.png",
  "./icons/AppIcon.appiconset/114.png",
  "./icons/AppIcon.appiconset/152.png",
  "./icons/AppIcon.appiconset/167.png",
  "./icons/AppIcon.appiconset/180.png",
  "./icons/AppIcon.appiconset/256.png",
  "./icons/AppIcon.appiconset/512.png",
  "./icons/AppIcon.appiconset/1024.png",
  "./images/stadion.jpg",
  "./images/logo.png",
  "./images/team_logo.svg",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME })
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Premiere League';
  }

  const options = {
    body: body,
    icon: './icons/AppIcon.appiconset/100.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Premiere League', options)
  );
});