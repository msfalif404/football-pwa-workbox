const BASE_URL = "https://api.football-data.org/v2/";
const API_TOKEN = "62f0176b2e6241cbad31e18d885d6d86";
const LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_TEAM_DETAILS = `${BASE_URL}teams/`;
const ENDPOINT_PLAYER_DETAILS = `${BASE_URL}players/`;

// Function to fetching resources
const FetchAPI = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                "X-Auth-Token": API_TOKEN
            }
        });
        if (response.status === 200) {
            return Promise.resolve(response.json());
        } else {
            console.log("Error", response.status);
            return Promise.reject(new Error(response.statusText));
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to checks whether the endpoint is already in cache or not
// if there is already data, it will be displayed using another function
function IsCacheExist(endpoint){
    return new Promise((resolve, reject) =>{
        if("caches" in window){
            caches.match(endpoint)
                .then(response => {
                    if(response){
                        resolve(response.json());
                    }
                })
                .catch(error => console.log(error));
        }
        else {
            reject(error);
        }
    });
}

// Function to showing all data from 2021 matches and display it to index.html from script.js
// First fetch the data from the resources
// If it's failed and the data is exist on cache storage then serve it
function ShowAllStandings() {
    FetchAPI(ENDPOINT_COMPETITION)
        .then(result => ShowStanding(result))
        .catch(() => {
            IsCacheExist(ENDPOINT_COMPETITION)
            .then(data => {
                ShowStanding(data);
            });
        });
}

// Function to showing all data from 2021 matches and make the html element, then display it using function above
function ShowStanding(data) {
    let standingDataContainer = document.getElementById("standing-data-container");
    let standing = "";
    data.standings[0].table.forEach(element => {
        const {team: {id, name}, won, draw, lost, points} = element;
        let {team: {crestUrl}} = element;
        if (crestUrl === null) {
            crestUrl = "Information Not Found";
        } else {
            crestUrl = `<img src="${crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="${name === null ? "Information Not Found" : name} Logo">`
        }
        standing += `
        <tr>
        <td>${crestUrl}</td>
        <td>${name === null ? "Information Not Found" : name}</td>
        <td>${won === null ? "Information Not Found" : won}</td>
        <td>${draw === null ? "Information Not Found" : draw}</td>
        <td>${lost === null ? "Information Not Found" : draw}</td>
        <td>${points === null ? "Information Not Found" : draw}</td>
        <td><a class="btn grey darken-4" href="team-details.html?id=${id}">See More Details</td>
        </tr>`;
    });
    standingDataContainer.innerHTML = standing;
}

// Function to showing the data of the team based on the id query string
// Then display it to team-details.html from script.js
// First fetch the data from the resources
// If it's failed and the data is exist on cache storage then serve it
function ShowTeamDetails() {
    return new Promise((resolve, reject) => {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        FetchAPI(`${ENDPOINT_TEAM_DETAILS}${idParam}`)
            .then(response => {
                ShowTeam(response);
                resolve(response);
            })
            .catch(() => {
                IsCacheExist(`${ENDPOINT_TEAM_DETAILS}${idParam}`)
                .then(data => {
                    ShowTeam(data);
                    resolve(data);
                });
            });
    });
}

// Function to showing the data of the team based on the id query string 
// then make the html element, then display it using function above
function ShowTeam(data) {
    const {address, email, founded, name, shortName, squad} = data;
    let {crestUrl} = data;
    if (crestUrl === null) {
        crestUrl = "Information Not Found";
    } else {
        crestUrl = `<img src="${crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${name === null ? "Information Not Found" : name} Logo">`;
    }
    const teamDataContainer = document.getElementById("team-data-container");
    teamDataContainer.innerHTML = `
                <div class="row">
                    <div class="col12">
                        <h3 id="team-name" class="center-align">${name ===  null ? "Information Not Found" : name} Information</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col m5">
                        ${crestUrl}
                    </div>
                    <div class="col m5">
                        <ul class="collection">
                            <li class="collection-item">Name : ${name === null ? "Information Not Found" : name}</li>
                            <li class="collection-item">Short Name : ${shortName === null ? "Information Not Found" : shortName}</li>
                            <li class="collection-item">Founded : ${founded === null ? "Information Not Found" : founded}</li>
                            <li class="collection-item">Address : ${address === null ? "Information Not Found" : address}</li>
                            <li class="collection-item">Email : ${email === null ? "Information Not Found" : email}</li>
                        </ul>
                    </div>
                </div>`;

    // This variable for slice the array to 10 element if the data exist
    // else, if the squad data from the response is null, the make this variable still null or meaning its doesnt usefull
    let playerSquad = null;

    let teamPlayerData = "";
    // Checking if the squads data exist, it there no data then display the not found information
    // else, if the squads data exit, then serve the data
    if (squad.length === 0) {
        teamPlayerData = `
                    <tr>
                    <td colspan="3">All Squads Information Not Found</td>
                    </tr>`;
    } else {
        playerSquad = squad.slice(-10);
        playerSquad.forEach(element => {
            const {name, position, role} = element;
            teamPlayerData += `
                        <tr>
                        <td>${name === null ? "Information Not Found" : name}</td>
                        <td>${position === null ? "Information Not Found" : position}</td>
                        <td>${role === null ? "Information Not Found" : role}</td>
                        </tr>`;
        });
    }
    const teamPlayerDataTableContainer = document.getElementById("team-player-data-table-container");
    teamPlayerDataTableContainer.innerHTML = teamPlayerData;
}

// Function to get all data from indexed db, from teams object store
// Then display it to pages/favourite-team.html
function GetFavouriteTeam() {
    dbGetAllTeam().then(data => {
        const favouriteTeamDataContainer = document.getElementById("favourite-team-data-container");
        let favourite = "";
        if (data.length === 0) {
            favourite = `<tr><td colspan="3">No Information Found</td></tr>`;
        }
        data.forEach(element => {
            const {id, name} = element;
            let {crestUrl} = element;
            if (crestUrl === null) {
                crestUrl = "Information Not Found";
            } else {
                crestUrl = `<img src="${crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="${name === null ? "Information Not Found" : name} Logo">`
            }
            favourite += `
            <tr>
                <td>${crestUrl}</td>
                <td>${name === null ? "Information Not Found" : name}</td>
                <td><a class="btn grey darken-4" href="team-details.html?id=${id}">See More Details</td>
                <td><a class="btn red darken-4 deleteTeamButton" id="${id}">Delete</td>
            </tr>`;
        });
        favouriteTeamDataContainer.innerHTML = favourite;

        // if the delete button clicked then trigger delete function from db.js
        // after its trigggered, then calling all data from indexed db again.
        const deleteTeamButton = document.querySelectorAll(".deleteTeamButton");
        for (let deleteButton of deleteTeamButton) {
            deleteButton.addEventListener("click", event => {
                dbDeleteTeamById(parseInt(event.target.id))
                    .then(() => {
                        GetFavouriteTeam();
                    });
            });
        }
    });
}

// Function to get indexed db data based from an id, from teams object store
// Then display it to teams-details.html
function GetFavouriteTeamById() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = parseInt(urlParams.get("id"));

    dbGetTeamById(idParam)
        .then(data => {
            if (data) {
                const {address, email, founded, shortName, squad} = data;
                let {crestUrl} = data;
                if (crestUrl === null) {
                    crestUrl = "Information Not Found";
                } else {
                    crestUrl = `<img src="${crestUrl.replace(/^http:\/\//i, 'https://')}">`;
                }
                const teamDataContainer = document.getElementById("team-data-container");
                teamDataContainer.innerHTML = `
                    <div class="row">
                        <div class="col12">
                            <h3 id="team-name" class="center-align">${name === null ? "Information Not Found" : name} Information</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col m5">
                            ${crestUrl}
                        </div>
                        <div class="col m5">
                            <ul class="collection">
                                <li class="collection-item">Name : ${name === null ? "Information Not Found" : name}</li>
                                <li class="collection-item">Short Name : ${shortName === null ? "Information Not Found" : shortName}</li>
                                <li class="collection-item">Founded : ${founded === null ? "Information Not Found" : founded}</li>
                                <li class="collection-item">Address : ${address === null ? "Information Not Found" : address}</li>
                                <li class="collection-item">Email : ${email === null ? "Information Not Found" : email}</li>
                            </ul>
                        </div>
                    </div>`;

                // This variable for slice the array to 10 element if the data exist
                // else, if the squad data from the response is null, the make this variable still null or meaning its doesnt usefull
                let playerSquad = null;

                let teamPlayerData = "";
                // Checking if the squads data exist, it there no data then display the not found information
                // else, if the squads data exit, then serve the data
                if (squad.length === 0) {
                    teamPlayerData = `
                        <tr>
                        <td colspan="3">All Squads Information Not Found</td>
                        </tr>`;
                } else {
                    playerSquad = squad.slice(-10);
                    playerSquad.forEach(element => {
                        const {name, position, role} = element;
                        teamPlayerData += `
                            <tr>
                                <td>${name === null ? "Information Not Found" : name}</td>
                                <td>${position === null ? "Information Not Found" : position}</td>
                                <td>${role === null ? "Information Not Found" : role}</td>
                            </tr>`;
                    });
                }
                const teamPlayerDataTableContainer = document.getElementById("team-player-data-table-container");
                teamPlayerDataTableContainer.innerHTML = teamPlayerData;

                // If the data already stored, then makes the button become the delete button
                // and trigger the delete function from idb.js
                // after triggered, then load the page
                teamButton.children[0].innerHTML = "delete";
                if (teamButton.children[0].innerHTML === "delete") {
                    teamButton.addEventListener("click", event => {
                        event.target.innerHTML = "save";
                        dbDeleteTeamById(idParam);
                        let toastHtml = `<span>Data deleted </span>
                        <div class="preloader-wrapper small active">
                        <div class="spinner-layer spinner-red-only">
                          <div class="circle-clipper left">
                            <div class="circle"></div>
                          </div><div class="gap-patch">
                            <div class="circle"></div>
                          </div><div class="circle-clipper right">
                            <div class="circle"></div>
                          </div>
                        </div>
                      </div>`;
                    M.toast({html: toastHtml, displayLength: 2500, completeCallback:function(){location.reload()}})
                    });
                }
            }
        })
        .catch(error => {
            // If the team not saved, then trigger the button become the save button
            // and trigger the insert function from idb.js
            // after triggered, then load the page
            if (error) {
                if (teamButton.children[0].innerHTML === "save") {
                    teamButton.addEventListener("click", event => {
                        event.target.innerHTML = "delete";
                        teamDetails.then(response => {
                            dbInsertTeam(response);
                            let toastHtml = `<span>Data stored </span>
                            <div class="preloader-wrapper small active">
                            <div class="spinner-layer spinner-red-only">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div><div class="gap-patch">
                                <div class="circle"></div>
                            </div><div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                            </div>
                        </div>`;
                        M.toast({html: toastHtml, displayLength: 2500, completeCallback:function(){location.reload()}})
                        });
                    });
                }
            }
        });
}