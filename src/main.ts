import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RootModule } from './app/root/root.module';
import { environment } from './environments/environment';

import * as Fingerprint2 from 'fingerprintjs2';
import { Md5 } from 'md5-typescript';

if (environment.production) {
  enableProdMode();
}


window.onload = function () {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDMsqfUhZyCVDDffLDX9uOEFQvvxUUYkAU&libraries=places';
  document.head.appendChild(scriptElement);

};

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('arxrf-root') !== undefined) {
    platformBrowserDynamic().bootstrapModule(RootModule)
      .catch(err => console.log(err));
  }
});

Fingerprint2.get(function (result) {
  const fingerObj = {};
  for (let i = 0; i < result.length; i++) {
    let objValues = result[i].value;
    if (result[i].key === 'canvas' || result[i].key === 'plugins' || result[i].key === 'webgl' || result[i].key === 'fonts') {
      objValues = Md5.init(result[i].value);
    }
    fingerObj[result[i].key] = objValues;

  }
  sessionStorage.setItem('deviceinfo', JSON.stringify(fingerObj));
});
