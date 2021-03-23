const admin = require("firebase-admin");

module.exports.sendNotification = async (tokens, title, body, imgurl, data = {},) => {
    await admin.messaging().sendToDevice(
        tokens,
        {
            data: {
                data: data,
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

