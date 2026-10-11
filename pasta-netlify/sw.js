/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "1d1ff17f93a93d82c256b0aa0c7413e5"
  }, {
    "url": "pwa-512x512.png",
    "revision": "1d1ff17f93a93d82c256b0aa0c7413e5"
  }, {
    "url": "pwa-192x192.png",
    "revision": "56a185c8439286e0a639af7e58bcea0e"
  }, {
    "url": "play-store-icon.png",
    "revision": "1d1ff17f93a93d82c256b0aa0c7413e5"
  }, {
    "url": "index.html",
    "revision": "625dfeef11d8bf795132618c1ee96617"
  }, {
    "url": "icon.svg",
    "revision": "8b49c9345ed80646575817b7e56bffbe"
  }, {
    "url": "feature-graphic.svg",
    "revision": "e47d06f2abdb8594c8cab1cac8695f77"
  }, {
    "url": "feature-graphic.png",
    "revision": "4e75966e173df789d6013b47d6f602e6"
  }, {
    "url": "favicon.ico",
    "revision": "ee83f1ec2316540d484c7ad80d4a0850"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "df5ed2f4697798ad9934ed9f25f19b82"
  }, {
    "url": "assets/index-CSi_b-GG.js",
    "revision": null
  }, {
    "url": "assets/index-C9lxU8pH.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "df5ed2f4697798ad9934ed9f25f19b82"
  }, {
    "url": "favicon.ico",
    "revision": "ee83f1ec2316540d484c7ad80d4a0850"
  }, {
    "url": "icon.svg",
    "revision": "8b49c9345ed80646575817b7e56bffbe"
  }, {
    "url": "pwa-192x192.png",
    "revision": "56a185c8439286e0a639af7e58bcea0e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "1d1ff17f93a93d82c256b0aa0c7413e5"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "1d1ff17f93a93d82c256b0aa0c7413e5"
  }, {
    "url": "manifest.webmanifest",
    "revision": "2e3e54693675366796fb2ed8a5743697"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
