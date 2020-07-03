importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: './', revision: '93' },
  { url: './index.html', revision: '93' },
  { url: './home.html', revision: '93' },
  { url: './match.html', revision: '93' },
  { url: './clubs.html', revision: '93' },
  { url: './club-detail.html', revision: '93' },
  { url: './favorite-clubs.html', revision: '93' },
  { url: './saved-match.html', revision: '93' },
  { url: './main.js', revision: '93' },
  { url: './manifest.json', revision: '93' }
]);

workbox.routing.registerRoute(
  /\.(?:html|js|json)$/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('/images/'),
  workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
  })
);

workbox.routing.registerRoute(
  new RegExp('/icons/'),
  workbox.strategies.cacheFirst({
      cacheName: 'icons',
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
  workbox.strategies.networkFirst({
    cacheName: 'football-data'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.cacheFirst({
    cacheName: 'club-logo'
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