const admin = require("firebase-admin");

const findUserTokenByID = async (userID) => {
    let userToken;
    try {
        const db = admin.database();
        const query = db.ref('users').orderByKey();
        await query.once("value", snapshot => {
            snapshot.forEach(child => {
                if (child.key === userID) {
                    userToken = child.val().token;
                    return true;
                }
            });
        });

        return userToken;

    } catch (e) {
        console.log(e);
    }
}

exports.findUserTokenByID = findUserTokenByID;