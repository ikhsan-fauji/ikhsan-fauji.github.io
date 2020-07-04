import 'regenerator-runtime';

// Style Sheet
import './styles/style.css';
import 'materialize-css/dist/css/materialize.min.css';

// JavaScript
import app from './script/utils/enums.js'
import main from './script/view/main.js';

document.addEventListener("DOMContentLoaded", main);

if ("serviceWorker" in navigator) {
  registerServiceWorker();
  requestPermission();
  pushManager();
} else {
  console.debug("Service worker is not suported in this browser");
}

function registerServiceWorker () {
  window.addEventListener("load", function ()  {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then( function () {
        console.debug("Service worker registration success");
      })
      .catch( function () {
        console.debug("Service worker registration failed");
      });
  });
}

function requestPermission () {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      navigator.serviceWorker.getRegistration().then(function(reg) {
        console.log('Notifikasi diijinkan!');
      });
    });
  }
}

function pushManager () {
  if (('PushManager' in window)) {
    navigator.serviceWorker.getRegistration().then(function (registration) {
      if (registration) {
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(app.PUBLIC_KEY)
        }).then(function (subscribe) {
            console.log('Subscribe endpoint: ', subscribe.endpoint);
            console.log(
              'Subscribe p256dh key: ',
              btoa(String.fromCharCode.apply(
                  null,
                  new Uint8Array(subscribe.getKey('p256dh'))
                )
              )
            );
            console.log(
              'Subscribe auth key: ',
              btoa(String.fromCharCode.apply(
                  null,
                  new Uint8Array(subscribe.getKey('auth'))
                )
              )
            );
        }).catch(function(e) {
            console.error('Tidak dapat melakukan subscribe ', e.message);
        });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  console.debug(base64String)
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

window.onerror = () => {
  return true;
}