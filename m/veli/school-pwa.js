'use strict';
// Kurulum kabuğu. Otomatik bildirim izni istemez; push/SMS göndermez.
(() => {
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 // Nihai paket ayrı /veli/ dizinine kurulmalıdır. Eski mobil köküne yanlış kayıt engellenir.
 const directory=new URL('./',location.href);
 if(!directory.pathname.endsWith('/veli/'))return;
 window.addEventListener('load',()=>{navigator.serviceWorker.register('school-sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});});
})();
