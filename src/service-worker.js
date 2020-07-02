importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: './', revision: '72' },
  { url: './#home', revision: '72' },
  { url: './#match', revision: '72' },
  { url: './#saved-match', revision: '72' },
  { url: './#clubs', revision: '72' },
  { url: './#club-detail', revision: '72' },
  { url: './#favorite-clubs', revision: '72' },
  { url: './index.html', revision: '72' },
  { url: './home.html', revision: '72' },
  { url: './match.html', revision: '72' },
  { url: './clubs.html', revision: '72' },
  { url: './club-detail.html', revision: '72' },
  { url: './favorite-clubs.html', revision: '72' },
  { url: './saved-match.html', revision: '72' },
  { url: './main.js', revision: '72' },
  { url: './manifest.json', revision: '72' }
]);

workbox.routing.registerRoute(
  /\.(?:html|js|json)$/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
      cacheName: 'image-icons',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data'
  })
);

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
    vibrate: [100, 58, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Premiere League', options)
  );
});