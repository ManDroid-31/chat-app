// firebase.js
import admin from "firebase-admin";
import { config } from "dotenv";
import User from "./models/User.js";
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
    if(!fcmToken || !message){
      console.log('invalid FCM token or message');
      return null;
    }
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
    if (err.code === 'messaging/registration-token-not-registered' || 
        err.code === 'messaging/invalid-registration-token') {
      
      console.log('Removing invalid FCM token from database');
      

      try {
        await User.updateMany(
          { fcm_token: fcmToken },
          { $unset: { fcm_token: "" } }
        );
        console.log('Invalid FCM token removed from database');
      } catch (dbError) {
        console.error('Error removing invalid token:', dbError);
      }
      
      return { error: 'Token invalid and removed' };
    }
    throw err;
  }
};