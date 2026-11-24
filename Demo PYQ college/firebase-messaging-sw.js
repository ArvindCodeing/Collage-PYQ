// firebase-messaging-sw.js
// Service worker for handling background Firebase Cloud Messaging notifications.
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Firebase project credentials (same as in index.html)
const firebaseConfig = {
  apiKey: "AIzaSyALNiis2UEzQAP_vRmlzI_9ShivO2wEHFA",
  authDomain: "collegepyq-120f7.firebaseapp.com",
  projectId: "collegepyq-120f7",
  storageBucket: "collegepyq-120f7.firebasestorage.app",
  messagingSenderId: "726374864349",
  appId: "1:726374864349:web:3255f152e945e715191234",
  measurementId: "G-4GQ7YKGDBV"
};

try{
  firebase.initializeApp(firebaseConfig);
}catch(e){ /* ignore if already initialized */ }

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'Notification';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: (payload.notification && payload.notification.icon) || '/favicon.ico',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const clickAction = event.notification?.data?.click_action || '/';
  event.waitUntil(clients.openWindow(clickAction));
});
