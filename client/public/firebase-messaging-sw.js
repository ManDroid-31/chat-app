importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAuOexMocs6HJEcm-N6RXHVweRJXENRN8o",
  authDomain: "dupesogs.firebaseapp.com",
  projectId: "dupesogs",
  storageBucket: "dupesogs.firebasestorage.app",
  messagingSenderId: "1077971599583",
  appId: "1:1077971599583:web:2ea1b38df03b976f2ea96a",
  measurementId: "G-CZE2C6Z63S"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '/logo.png', // optional
  });
});
