// Memasang (install) ULFALINE dari browser tanpa Play Store / App Store (PWA).

import { h } from './ui.js';

let promptTertunda = null;
const pendengar = new Set();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  promptTertunda = e;
  pendengar.forEach((f) => f());
});
window.addEventListener('appinstalled', () => {
  promptTertunda = null;
  pendengar.forEach((f) => f());
});

export const sudahTerpasang = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const iOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const bisaDipasang = () => !sudahTerpasang() && (promptTertunda !== null || iOS());

/** Blok berisi tombol/instruksi pemasangan yang menyesuaikan perangkat. */
export function blokPasang({ ringkas = false } = {}) {
  const wadah = h('div');
  function render() {
    wadah.replaceChildren();
    if (sudahTerpasang()) {
      wadah.append(h('p', {}, '✅ ULFALINE sudah terpasang di perangkat ini.'));
    } else if (promptTertunda) {
      wadah.append(
        ringkas ? null : h('p', {}, 'Pasang ULFALINE agar bisa dibuka dari layar utama seperti aplikasi biasa, juga saat offline.'),
        h('button', {
          class: 'tombol penuh', type: 'button',
          onclick: async () => {
            const p = promptTertunda;
            promptTertunda = null;
            p.prompt();
            await p.userChoice.catch(() => null);
            render();
          },
        }, '📲 Pasang Aplikasi'));
    } else if (iOS()) {
      wadah.append(h('p', {}, 'Di iPhone/iPad: buka di Safari, ketuk tombol Bagikan (kotak dengan panah ke atas), lalu pilih "Tambahkan ke Layar Utama".'));
    } else if (!ringkas) {
      wadah.append(h('p', {}, 'Buka menu browser (⋮) lalu pilih "Instal aplikasi" atau "Tambahkan ke layar utama". ',
        'Jika pilihan itu tidak muncul, pastikan alamatnya diawali https://.'));
    }
  }
  pendengar.add(render);
  render();
  return wadah;
}
