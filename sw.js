
const CACHE_NAME = "stopwatch-rakaat-v4";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(cacheNames => {

                return Promise.all(

                    cacheNames

                        .filter(name => name !== CACHE_NAME)

                        .map(name => caches.delete(name))

                );

            })

    );

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    // Hanya khusus halaman HTML utama
    if (event.request.mode === "navigate") {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    // Simpan versi terbaru ke cache
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                    // Gunakan versi terbaru
                    return response;

                })

                .catch(() => {

                    // Kalau tidak ada internet,
                    // gunakan versi yang tersimpan di cache

                    return caches.match(event.request);

                })

        );

        return;
    }


    // Untuk file selain halaman HTML:
    // gunakan cache dulu, kalau tidak ada baru internet

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                return response || fetch(event.request);

            })

    );

});
