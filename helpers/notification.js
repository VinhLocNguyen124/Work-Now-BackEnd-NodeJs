const admin = require("firebase-admin");

const sendNotification = async (tokens, title, body, imgurl) => {
    await admin.messaging().sendToDevice(
        tokens,
        {
            data: {
                imageUrl: imgurl,
            },
            notification: {
                body: body,
                title: title,
            },
        },
        {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
        },
    );
}

exports.sendNotification = sendNotification;

