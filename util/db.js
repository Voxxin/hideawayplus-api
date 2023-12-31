// Note this API is fully static, meaning that any time the server closed, the data will be lost.


const userArray = new Array();

/*
    Example User map:
    {
        "user": [
            "uuid": "uuid",
            "name": "name",
            "lastAlive": "timestamp"
        ],
        "code": "code"
    }
*/

function generateCode() {
    let uuid;
    do {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } while (userArray.includes(uuid));
    
    return uuid;
}

function addUser(uuid, name, code) {
    if (!uuidExists(uuid)) {
        userArray.push({
            "user": {
                "uuid": uuid,
                "name": name,
                "lastAlive": Date.now()
            },
            "code": code
        });

        return true;
    } else {
        return false;
    }
}


function userAlive(uuid, code) {
    if (uuidExists(uuid) && codeByUUID(uuid) === code) {
        const user = {
            "user": {
                "uuid": uuid,
                "name": nameByUUID(uuid),
                "lastAlive": Date.now()
            },
            "code": code
        }

        userArray.splice(indexByUUID(uuid), 1, user);
    }
}

function removeUser(user) {
    if (userArray.includes(user)) {
        userArray.splice(user, 1);
    }
}

function userRemoveUser(uuid, code) {
    if (uuidExists(uuid) && codeByUUID(uuid) === code) {
        userArray.splice(uuidGetUser(uuid), 1);
    }
}

function checkUser(user) {
    if (userArray.includes(user)) {
        if (Date.now() - user.user.lastAlive >= 60000) {
            removeUser(user);
        }
    }
}

async function checkLiving() {
    userArray.forEach(user => {
        if (Date.now() - user.user.lastAlive >= 60000) {
            removeUser(user);
        }
    });
}


function indexByUUID(uuid) {
    return userArray.findIndex(user => user.user.uuid === uuid);
}

function uuidGetUser(uuid) {
    return userArray.filter(user => user.user.uuid === uuid);
}

function uuidExists(uuid) {
    return userArray.find(user => user.user.uuid === uuid)
}

function nameByUUID(name) {
    return userArray.find(user => user.user.uuid === name).user.name;
}

function codeByUUID(uuid) {
    return userArray.find(user => user.user.uuid === uuid).code;
}

function getUserList() {
    return userArray;
}

module.exports = {
    generateCode,
    addUser,
    userAlive,
    removeUser,
    userRemoveUser,
    checkUser,
    getUserList,
    checkLiving,

    uuidExists,
    codeByUUID
};