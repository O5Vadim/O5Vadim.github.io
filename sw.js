// Название кэша — если изменишь файлы, поменяй v1 на v2
const CACHE = 'интернет-офлайн-v1'

// Список файлов которые сохраняем для офлайна
const FILES = [
    '/',
    '/index.html',
    '/wikiwikiinternet.html',
    '/style.css'
]

// При первом посещении сохраняем все файлы в кэш
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    )
})

// При обновлении удаляем старый кэш
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    )
})

// Каждый запрос — сначала пробуем интернет, если нет — берём из кэша
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})