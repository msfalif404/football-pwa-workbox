// Creating new database
const idbPromised = idb.open("football-information-indexeddb", 1, upgradeDb => {
    if(!upgradeDb.objectStoreNames.contains("teams")){
        upgradeDb.createObjectStore("teams", {keyPath: "id"});
    }
});

// Function for getting all data from teams object store
const dbGetAllTeam = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", "readonly");
            return transaction.objectStore("teams").getAll();
        })
        .then(data => {
            if(data !== undefined){
                resolve(data);
            }
        })
        .catch(error => reject(error));
    })
}

// Function for getting data based from id from teams object store
const dbGetTeamById = teamId => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", "readonly");
            return transaction.objectStore("teams").get(teamId);
        })
        .then(data => {
            if(data !== undefined){
                resolve(data);
            }
            else {
                reject(new Error("No Data Found"));
            }
        })
        .catch(error => reject(error));
    })
}

// Function for inserting data to teams object store
const dbInsertTeam = teamData => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", "readwrite");
            return transaction.objectStore("teams").put(teamData);
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => reject(error));
    });
}

// Function for deleting data from teams object store
const dbDeleteTeamById = teamId => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", "readwrite");
            transaction.objectStore("teams").delete(teamId);
            return transaction;
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => reject(error));
    })
}