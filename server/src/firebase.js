import admin from "firebase-admin";
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

// Use the JSON file approach instead of environment variable

const firebaseConfig = process.env.FIREBASE_CONFIG;
const serviceAccount = JSON.parse(firebaseConfig);

// // Initialize Firebase Admin only if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(firebaseConfig),
//   });
// }

// export { admin };

export const sendPushNotification = async (fcmToken, message) => {
  try {
    const response = await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {}, // optional custom data
    });
    console.log("Notification sent successfully:", response);
    return response;
  } catch (err) {
    console.error("Failed to send FCM notification:", err);
    throw err;
  }
};