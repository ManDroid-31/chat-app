import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs"
// import serviceAccount from "../dupesogs-firebase-adminsdk-fbsvc-3d841ef93a.json" assert { type: "json" };

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };

export const sendPushNotification = async (fcmToken, message) => {
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {}, // optional custom data
    });
    console.log("Notification sent");
  } catch (err) {
    console.error("Failed to send FCM notification:", err);
  }
};
