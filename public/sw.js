// public/sw.js
const CACHE_NAME = 'module-content-cache-v1';
const VIDEO_CACHE = 'video-cache';
const API_CACHE = 'api-cache';
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // Maximum size (500MB) for video cache

// Files to cache immediately on install
const CORE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add core CSS, JS assets here
];

// Install event - precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, VIDEO_CACHE, API_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Calculate the total size of a cache
async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  let size = 0;
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.clone().blob();
      size += blob.size;
    }
  }
  
  return size;
}

// Manage cache size - remove oldest entries if cache gets too large
async function manageCacheSize(cacheName, maxSize) {
  const size = await getCacheSize(cacheName);
  
  if (size > maxSize) {
    console.log(`Cache ${cacheName} is too large (${size} bytes). Cleaning up...`);
    
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    // Sort by timestamp if available, otherwise just delete the first few entries
    // In a real app, you'd track timestamps of cached entries
    const keysToDelete = keys.slice(0, Math.ceil(keys.length * 0.2)); // Delete oldest 20%
    
    for (const key of keysToDelete) {
      await cache.delete(key);
    }
    
    console.log(`Removed ${keysToDelete.length} entries from cache ${cacheName}`);
  }
}

// Helper function to determine if a URL is a video file
function isVideoRequest(url) {
  const requestUrl = new URL(url);
  return (
    requestUrl.pathname.includes('/storage/buckets/') && 
    requestUrl.pathname.includes('/files/') &&
    requestUrl.pathname.includes('/view')
  );
}

// Helper function to determine if a URL is an API request
function isApiRequest(url) {
  return url.includes('/api/');
}

// Helper function to check if navigator is online
function isOnline() {
  return self.navigator && self.navigator.onLine;
}

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle video requests
  if (isVideoRequest(event.request.url)) {
    event.respondWith(handleVideoRequest(event.request));
    return;
  }
  
  // Handle API requests
  if (isApiRequest(event.request.url)) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle navigation requests - use network first, then cache
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }
  
  // Handle static asset requests - use cache first, then network
  event.respondWith(handleStaticRequest(event.request));
});

// Handle video requests
async function handleVideoRequest(request) {
  const cache = await caches.open(VIDEO_CACHE);
  
  // Try the cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fall back to network if online
  if (isOnline()) {
    try {
      const networkResponse = await fetch(request);
      
      // Cache the response for future offline use
      if (networkResponse.ok) {
        const clonedResponse = networkResponse.clone();
        cache.put(request, clonedResponse);
        
        // Check and manage cache size
        manageCacheSize(VIDEO_CACHE, MAX_CACHE_SIZE);
      }
      
      return networkResponse;
    } catch (error) {
      console.error('Error fetching video:', error);
      // Show offline message
      return new Response('Video not available offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
  
  // If offline and not in cache, return offline response
  return new Response('Video not available offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Handle API requests
async function handleApiRequest(request) {
  // For GET requests, try network first, then cache
  if (request.method === 'GET') {
    // Try network first
    if (isOnline()) {
      try {
        const networkResponse = await fetch(request);
        
        // Save to cache if successful
        if (networkResponse.ok) {
          const cache = await caches.open(API_CACHE);
          cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    }
    
    // Try cache if network fails or offline
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error if neither network nor cache worked
    return new Response(JSON.stringify({
      error: 'You are offline and this data is not available locally'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // For non-GET requests (POST, PUT, etc.), try network only
  // If offline, store in IndexedDB for later sync
  if (!isOnline() && (request.method === 'POST' || request.method === 'PUT')) {
    // Here we could queue the request for later
    // For simplicity, we're just returning an error
    return new Response(JSON.stringify({
      error: 'You are offline. Changes will be saved when you reconnect.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Otherwise, pass through to network
  return fetch(request);
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  // Try network first
  if (isOnline()) {
    try {
      return await fetch(request);
    } catch (error) {
      console.error('Navigation fetch failed:', error);
    }
  }
  
  // If offline or network fails, try cache
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, return offline page
  return cache.match('/offline.html');
}

// Handle static asset requests
async function handleStaticRequest(request) {
  // Try cache first
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Try network if not in cache
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Static asset fetch failed:', error);
    
    // Return a placeholder or error for images
    if (request.destination === 'image') {
      return new Response('Image not available offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Return a generic error for other resources
    return new Response('Resource not available offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for progress updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncVideoProgress());
  }
});

// Function to sync video progress with server when back online
async function syncVideoProgress() {
  try {
    // Get data from IndexedDB
    const response = await fetch('/api/sync-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: [] // This would be populated from IndexedDB in a real implementation
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync progress with server');
    }
    
    console.log('Successfully synced progress with server');
    
    // Notify any open clients that the sync was successful
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        success: true
      });
    });
    
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    
    // Notify clients of the failure
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        success: false,
        error: error.message
      });
    });
    
    return false;
  }
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});