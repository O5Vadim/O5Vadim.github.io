// Название кэша латиницей (надёжнее)
const CACHE = 'offline-cache-v10';

// Список файлов для сохранения
const FILES = [
    '/',
    '/index.html',
    '/404.html',
    '/wiki/',
    '/http/',
    '/http/index.html',
    '/wiki/index.html',
    '/style.css'
];

// Установка: сохраняем всё в кэш и сразу активируем
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    );
    self.skipWaiting(); // Чтобы обновление вступило в силу сразу
});

// Активация: чистим старые версии кэша
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
});

// Запросы: Сначала интернет -> Кэш -> Страница 404
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request).then(response => {
                // 1. Если файл есть в кэше (например, index.html), отдаем его
                if (response) return response;
                
                // 2. Если файла в кэше нет и интернета нет — отдаем 404.html
                return caches.match('/404.html');
            });
        })
    );
});
