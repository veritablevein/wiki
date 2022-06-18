importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉Service Worker is working!`);
} else {
  console.log(`Boo! Workbox didn't load 😬Service Worker won't work properly...`);
}

const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute, matchPrecache } = workbox.precaching;

precacheAndRoute([{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"favicon.ico"},{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"images/favicon.ico"},{"revision":"d41d8cd98f00b204e9800998ecf8427e","url":"images/fishing.png"},{"revision":"103f4f1d03a6901235eeae59078fa231","url":"images/image.png"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"images/TiddlyWikiIconBlack.png"},{"revision":"6d5ad68a36222fb106ebefe49484c9be","url":"images/TiddlyWikiIconBlue.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"images/TiddlyWikiIconWhite.png"},{"revision":"dcb89f8973e92b826c05a515d7382a63","url":"index.html"},{"revision":"0af53682c2c8ae34415be66e17565775","url":"offline.html"},{"revision":"d13a3a783d79ae942a24a9da80956be3","url":"tiddlywikicore-5.2.3-prerelease-2022-04-09.js"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"TiddlyWikiIconBlack.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"TiddlyWikiIconWhite.png"}]);

registerRoute(
  /\.css$/,
  // Use cache but update in the background.
  new StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  })
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|woff2?|ttf)$/,
  // Use the cache if it's available.
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        // Cache only a few images.
        maxEntries: 100,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(/\.js$/, new StaleWhileRevalidate());
registerRoute(/(^\/$|index.html)/, new StaleWhileRevalidate());
