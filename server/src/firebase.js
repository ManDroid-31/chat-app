// firebase.js
import admin from "firebase-admin";
import { config } from "dotenv";
config();
// import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

const json = JSON.stringify(process.env.FIREBASE_CONFIG);
const temp = JSON.parse(json);
console.log("serviceAccount",JSON.parse(temp));

const serviceAccount = JSON.parse(temp);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();

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