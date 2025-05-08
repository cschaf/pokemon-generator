const CACHE_NAME = 'pokemon-generator-cache-v1'; // Change version to force update
const urlsToCache = [
    './', // Cache the root directory (often serves index.html)
    './index.html',
    // Add other essential static assets IF they were separate files (e.g., './style.css', './script.js')
    // Since CSS/JS are inline, index.html covers them.
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css', // Cache Font Awesome
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap', // Cache Google Font CSS request
    // Cache webfonts if loaded by the Google Font CSS (browser might handle this, but explicit can help)
    // Add specific font file URLs if needed - check Network tab in dev tools
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/normal.svg', // Example type icon - Cache *all* needed type icons
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fire.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/water.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/electric.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/grass.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ice.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fighting.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/poison.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ground.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/flying.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/psychic.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/bug.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/rock.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ghost.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/dragon.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/dark.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/steel.svg',
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fairy.svg',
    './favicon.ico',
    './manifest.json', // Cache the manifest itself
    // Add your actual icon paths here once created:
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install event: Cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Use addAll for atomic caching - if one fails, none are added
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error("Failed to cache assets during install:", err);
                // Optionally skip waiting to allow activation even if caching fails partially
                // self.skipWaiting();
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) { // Delete caches not matching the current version
                        console.log('Service Worker: Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
            // Force the activated service worker to take control immediately
            .then(() => self.clients.claim())
    );
});

// Fetch event: Serve cached assets first, fallback to network
self.addEventListener('fetch', event => {
    // Strategy: Cache first, then network fallback.
    // We only apply this to GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    // Don't cache PokeAPI requests or image sprites in the SW Cache
    // Let browser HTTP cache and localStorage handle those.
    const isApiRequest = event.request.url.includes('pokeapi.co');
    const isSpriteRequest = event.request.url.includes('raw.githubusercontent.com'); // Adjust if sprite source changes
    const isFlagRequest = event.request.url.includes('flagcdn.com'); // Let browser cache flags

    if (isApiRequest || isSpriteRequest || isFlagRequest) {
        // Go directly to network for API/Sprites/Flags
        event.respondWith(fetch(event.request));
        return;
    }

    // For App Shell resources (HTML, FA, Fonts, Type Icons, Manifest, App Icons)
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Cache hit - return response
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Not in cache - fetch from network
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
                            return networkResponse; // Don't cache errors or opaque responses for app shell
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Cache the fetched response
                                // Only cache resources listed initially or resources from same origin or known CDNs
                                if(urlsToCache.includes(event.request.url) || event.request.url.startsWith(self.location.origin) || event.request.url.includes('cdnjs.cloudflare.com') || event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com') || event.request.url.includes('cdn.jsdelivr.net')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return networkResponse; // Return original network response to browser
                    }
                ).catch(error => {
                    console.error('Fetch failed; returning offline page instead.', error);
                    // Optional: return a specific offline fallback page/asset if needed
                    // return caches.match('./offline.html');
                });
            })
    );
});
