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
      "endpoint": "https://fcm.googleapis.com/fcm/send/f6Av6Ux3w9g:APA91bH0VzolYl61HLrLzskOEBSeb_KJEuD7nyLbBeJM7CZIFPEn4sRnWdfsm75Ug5glcZV5sPbrtNUOcxbgpcsYsSe21wS-l_M5aTGFmTkZPO8wBZsTU6D0ZvQDfUeiMDFI0VO9_4wG",
      "keys": {
          "p256dh": "BHI5GnIO4l6F3lKM6fttBb8QDQk8UbXITlZXZNgZYhzjBkjeabUw7mokUnSRADt7J3moiRG6p+YoT9bw/JU1lLo=",
          "auth": "VCKq6yvrbS5+uT/AgbTK5Q=="
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