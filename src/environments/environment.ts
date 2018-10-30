// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA6t_RtIPQiCJj9yhaoVu_j9zUflsLQ8ek',
    authDomain: 'nuwa-designer.firebaseapp.com',
    databaseURL: 'https://nuwa-designer.firebaseio.com',
    projectId: 'nuwa-designer',
    storageBucket: 'nuwa-designer.appspot.com',
    messagingSenderId: '894139536621'
  },
  firebasespa: {
    apiKey: 'AIzaSyBbiCqbqJwjEiinoCrgfkE9zurR2L0DTwU',
    authDomain: 'spa-voucher.firebaseapp.com',
    databaseURL: 'https://spa-voucher.firebaseio.com',
    projectId: 'spa-voucher',
    storageBucket: 'spa-voucher.appspot.com',
    messagingSenderId: '362408658174'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
