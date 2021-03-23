const admin = require("firebase-admin");

const findGuessToken = (roomKey, ownerID) => {
    const arr = roomKey.split("_");
    const guessID = ownerID === arr[0] ? arr[1] : arr[0];
    let guessToken;

    try {
        const db = admin.database();
        const query = db.ref('users').orderByKey();
        await query.once("value", snapshot => {
            snapshot.forEach(child => {
                if (child.key === guessID) {
                    guessToken = child.val().token;
                    return true;
                }
            });
        });

        return guessToken;

    } catch (e) {
        console.log(e);
    }
}

exports.findGuessToken = findGuessToken;