// Daily Digest Service Worker
const CACHE_NAME = 'daily-digest-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存
        if (response) {
          // 后台更新缓存
          fetch(event.request)
            .then(newResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, newResponse);
              });
            })
            .catch(() => {});
          
          return response;
        }
        
        // 缓存未命中，网络请求
        return fetch(event.request)
          .then(response => {
            // 缓存新资源
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // 离线时返回默认页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// 处理推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Daily Digest 有新内容更新',
    icon: './icon-192x192.png',
    badge: './badge-72x72.png',
    tag: 'daily-digest-update',
    requireInteraction: false,
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Daily Digest', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
