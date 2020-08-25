// Function to convert server key from base 64 to Uint8
function urlBase64ToUint8Array(base64String){
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
// Function to registering the service worker
function registerServiceWorker(){
    return navigator.serviceWorker.register("./service-worker.js")
    .then(response => {
        console.log("Service Worker Succesfully added");
    })
    .catch(error => console.log(error));
}
// Function to requesting the permission if it's supported
function requestPermission(){
    if("Notification" in window){
        Notification.requestPermission()
        .then(response => {
            if(response === "denied"){
                console.log("Notifikasi Tidak diizinkan");
                return;
            }
            else if(response === "default"){
                console.log("Notifikasi Ditutup");
                return;
            }
            else {
                navigator.serviceWorker.ready.then(() => {
                    if("PushManager" in window){
                        navigator.serviceWorker.getRegistration()
                        .then(function(registration){
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array("BDoktGkcTRFf8m3amdf2Ssb10ZwoesbyJifv4Sh6lVmvYuQNszAsS1AEduN-VAOTkyCT_mq7En_KN0IjCSVbXLs")
                            })
                            .then(function(subscribe){
                                console.log("Berhasil melakukan subscribe dengan endpoint", subscribe.endpoint);
                                console.log("Berhasil melakukan subscribe dengan p256dh key: ",
                                btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
                                console.log('Berhasil melakukan subscribe dengan auth key: ', 
                                btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth')))));
                            })
                            .catch(function(error){
                                console.log("Tidak Dapat Melakukan Subscribe", error);
                            });
                        });
                    }
                })
            }
        });
    }
}