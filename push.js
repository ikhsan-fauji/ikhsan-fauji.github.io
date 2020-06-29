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
      "endpoint": "https://fcm.googleapis.com/fcm/send/f9VKNBYcWm8:APA91bGFilSTF55Ee9HdMYVSzhDKz2rkXOLGLTK2Vh-G8O4kEMtXH-SVnXpmvQ-MOJeWFyM9Ap-ECc0vnqHhHBmiND1WJx-2xljuM_xd-HOSEkcpUBN3WZIUI0aBFLJAt8y6TL1rAJS6",
      "keys": {
          "p256dh": "BHp6xgT5+PtZJKaccyDLTsdMGwQE7mN65nQydcuZIByytKxXpqaK2BCuCCf2ey86tDlbNmiLxh8fdjZoD8leAFk=",
          "auth": "5Es7iMe+Q2c/Zj27/W6Viw=="
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