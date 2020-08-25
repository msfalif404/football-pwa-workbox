var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BDoktGkcTRFf8m3amdf2Ssb10ZwoesbyJifv4Sh6lVmvYuQNszAsS1AEduN-VAOTkyCT_mq7En_KN0IjCSVbXLs",
    "privateKey": "20aQD-YLgrzVTaD8Bw--WI05OgHtE_nrK6842g433Nw"
};
 
 
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/drb_fIXHwsA:APA91bHmAfMjfxG98bYrXUbMw8pWEbLH4jAcsY9kAgfTdg8GBahp9fUKciYyJa8o9KDgKgbCwSV6JD_gcUTt4T2cCwWi48-XSJz9Gr4p2j4AYX_VDVSYB8Xs18drlS5s-eEppAIf_R7k",
    "keys": {
        "p256dh": "BOm/G303DeEk6dgPYECE99EFrYjuE9btFgrWvvHEhG+zcx5EiOgkCyUFpRuRrvLPRs6CBSYfxejC4jXYA5YzRP0=",
        "auth": "XFUlX3Y4elA/7NKwfM5aNA=="
    }
};
var payload = 'Selamat! Football PWA berhasil menerima push notifikasi!';
var options = {
    gcmAPIKey: '171706402108',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);