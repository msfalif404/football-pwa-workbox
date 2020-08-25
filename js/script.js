// Initialize materialize sidenav
let sidenav = document.querySelectorAll(".sidenav");
M.Sidenav.init(sidenav);

// Function for load the content of nav.html
async function LoadNavContent(){
    try {
        const response = await fetch("nav.html");
        const result = await response.text();
        document.querySelectorAll(".navbar, .sidenav").forEach(element => {
            element.innerHTML = result;
        });
        // Trigget the LoadPage function if the navbar or sidenav clicked
        document.querySelectorAll(".navbar a, .sidenav a").forEach(element => {
            element.addEventListener("click", event => {
                const sidenavInstance = document.querySelector(".sidenav");
                M.Sidenav.getInstance(sidenavInstance).close()
                page = event.target.getAttribute("href").substr(1);
                LoadPage(page);
            })
        })
    }
    catch(error){
        console.log(error);
    }
}

// Function to dynamically change the page based on url attribute
async function LoadPage(page){
    try {
        const response = await fetch(`pages/${page}.html`);
        
        if(response.status === 200){
            if(page === "index-page"){
                ShowAllStandings();
            }
            else if(page === "favourite-team"){
                GetFavouriteTeam();
            }
            const result = await response.text();
            let indexContainer = document.getElementById("index-container");
            indexContainer.innerHTML = result;
        }
        else if(response.status === 404){
            indexContainer.innerHTML = "<h3>Halaman Tidak Ditemukan</h3>";
        }
        else {
            indexContainer.innerHTML = "<h3>Halaman Tidak Dapat Diakses</h3>";
        }
    }
    catch(error){
        console.log(error);
    }
}

// Get the url # attribute, if its doesn't have a value, then make #index-page as the default value
let page = window.location.hash.substr(1);
page === "" ? page = "index-page" : page = page;
LoadPage(page); 

LoadNavContent();