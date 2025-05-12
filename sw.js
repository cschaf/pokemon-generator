const CACHE_NAME = 'pokemon-generator-cache-v2'; // Increment version due to file structure changes
const urlsToCache = [
    './', // Cache the root directory
    './index.html',
    './css/style.css', // Cache the CSS file
    './js/pokedex-data.js', // Cache JS files
    './js/i18n.js',
    './js/app.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    // Cache needed type icons (keep the list or load dynamically if preferred)
    'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/normal.svg',
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
    './manifest.json',
    './icons/icon-192.png', // Cache PWA icons with correct path
    './icons/icon-512.png'
];

// Install event: Cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error("Failed to cache assets during install:", err);
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
            .then(() => self.clients.claim())
    );
});

// Fetch event: Serve cached assets first, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    // Network first for API, Sprites, Flags (or Cache then Network if offline sprites are desired)
    const isApiRequest = event.request.url.includes('pokeapi.co');
    // Assuming sprites still come from official artwork URL (adjust if different)
    const isSpriteRequest = event.request.url.includes('raw.githubusercontent.com/PokeAPI/sprites') || event.request.url.includes('placehold.co');
    const isFlagRequest = event.request.url.includes('flagcdn.com');
    const isFontRequest = event.request.url.includes('fonts.gstatic.com'); // Also cache font files

    // Cache-First strategy for App Shell and Type Icons
    if (!isApiRequest && !isSpriteRequest && !isFlagRequest) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Not in cache, fetch from network
                    return fetch(event.request).then(
                        networkResponse => {
                            // Check if we received a valid response
                            // Allow caching opaque responses for CDNs like fonts.gstatic.com
                            if (!networkResponse || networkResponse.status !== 200 ) {
                                // Don't cache non-200 responses unless it's a known CDN where opaque responses are expected
                                if (networkResponse.type !== 'opaque' || !isFontRequest) {
                                    return networkResponse;
                                }
                            }

                            const responseToCache = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    // Cache the fetched response
                                    cache.put(event.request, responseToCache);
                                });

                            return networkResponse;
                        }
                    ).catch(error => {
                        console.error('Fetch failed; returning offline page or asset might be needed.', error);
                        // Optional: return caches.match('./offline.html');
                    });
                })
        );
    } else {
        // For API, Sprites, Flags - Network first, cache fallback (optional, useful for offline sprites)
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    // Optionally cache successful sprite/flag responses
                    // if ((isSpriteRequest || isFlagRequest) && networkResponse.ok) {
                    //     const responseToCache = networkResponse.clone();
                    //     caches.open(CACHE_NAME).then(cache => {
                    //         cache.put(event.request, responseToCache);
                    //     });
                    // }
                    return networkResponse;
                })
                .catch(() => {
                    // If network fails for sprite/flag, try cache
                    // if (isSpriteRequest || isFlagRequest) {
                    //     return caches.match(event.request);
                    // }
                    // Don't provide offline fallback for API requests usually
                })
        );
    }
});
