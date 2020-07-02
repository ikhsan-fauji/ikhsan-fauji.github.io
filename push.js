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
      "endpoint": "https://fcm.googleapis.com/fcm/send/fVQvzdpUNAI:APA91bEg46izlZqzsNlWMYH2HxRaUjyGtq2qWdeob9ISv-epuE-t8vlaZxtZQ9z--ZDB4A8wGm27a6NYp28_lojU-CBSNUo2eedeLp3neneN8OC3CmePxGjGBBlriVsmJuoT6T9DbD0N",
      "keys": {
          "p256dh": "BLLkt79z/VUFYY+FoXv5QxMbgWnRAbnffqpTqQHotAUqgXNc9tK9UF+8zdLUrjybttzDGPSvr1dBE88fArYS4LU=",
          "auth": "BMFtTbPWFGhKX9sl+/9qXw=="
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
    console.debug(res)
  }).catch(err => {
    console.debug('Error: ', err.message)
  });

} catch (error) {
  console.debug(error.message)
}