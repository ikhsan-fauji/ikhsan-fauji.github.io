const webPush = require('web-push');

try {

  const vapidKeys = {
      "publicKey": "BGdWxRjXLfOLvyOhBtaxxO3EpOB_o1hI0_bqzVvlczhBfBXT4iMtPRQsiODvoIvzZm0rqV95_eDaFpTlTiziT9M",
      "privateKey": "tpBNPTe_oXspMtn9dfyY274wr0_CyvFKdNaCBgZeyOA"
  };

  webPush.setVapidDetails(
      'mailto:ikhsan15fauji@gmail.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
  )

  const pushSubscription = {
      "endpoint": "https://fcm.googleapis.com/fcm/send/cbZDQDsJegc:APA91bE-NMw6wFD8Dmh_aU19ruWKiwNJzfF5ywiXkR4dIrqW4EW3WMcgeVBMl8TP4XchjxwLOmnJX2QPkpZCas6RKnLFT4WRgxgRCizKzmhKEntLzmDDD1WBtrV0yl-IHu8ER3lk0xVH",
      "keys": {
          "p256dh": "BHKKXcPiZebQVmEoaJUOSTlsdywYg7AqmezN+zPtdMbERMbxCtIrH2aAkhVIH9OV8RomIEgLFCJGsyaGgcqENj0=",
          "auth": "lywgD/jjAARrlMjEWCiDpg=="
      }
  };

  const payload = 'Jadwal pertandingan baru telah rilis';

  const options = {
      gcmAPIKey: '293219957975',
      TTL: 60
  };

  webPush.sendNotification(
    pushSubscription,
    payload,
    options
  ).then(res => {
    // console.debug(res)
  }).catch(err => {
    // console.debug('Error: ', err.message)
  });

} catch (error) {
  // console.debug(error.message)
}