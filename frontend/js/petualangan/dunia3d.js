// Dunia 3D "Pulau Aljabar" (three.js, low-poly agar ringan di HP).
// Semua model dibuat dari bentuk dasar di kode ini: karakter & bangunan ORISINAL milik ULFALINE.
// Animasi hanya berjalan saat diperlukan dan menghormati pengaturan "Kurangi gerakan".

import { gerakDikurangi } from '../simpan.js';
import { efek } from './suara.js';

const JALAN = [
  [-13, 13], [-10, 8], [-3, 10], [4, 7], [10, 1], [5, -5], [-6, -5], [2, -14], [10, -20],
];
// Indeks titik jalan untuk tiap pos (0 = titik awal, 8 = Pulau Harta).
export const TITIK_POS = [1, 2, 3, 4, 5, 6, 7];
export const TITIK_HARTA = 8;

let THREE = null;

async function muatThree() {
  if (!THREE) THREE = await import('../../vendor/three.module.min.js');
  return THREE;
}

export function dukungWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

// --------------------------------------------------------------- pembantu model
function bahan(warna) {
  return new THREE.MeshLambertMaterial({ color: warna, flatShading: true });
}

function mesh(geo, warna, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, bahan(warna));
  m.position.set(x, y, z);
  return m;
}

function pohon(x, z, s = 1) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.15 * s, 0.2 * s, 0.9 * s, 6), 0x7a5420, 0, 0.45 * s, 0));
  g.add(mesh(new THREE.ConeGeometry(0.8 * s, 1.4 * s, 7), 0x2e8b57, 0, 1.4 * s, 0));
  g.add(mesh(new THREE.ConeGeometry(0.6 * s, 1.1 * s, 7), 0x3aa76d, 0, 2.0 * s, 0));
  g.position.set(x, 0, z);
  return g;
}

function kelapa(x, z) {
  const g = new THREE.Group();
  const batang = mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.4, 6), 0x9b6b3a, 0, 1.2, 0);
  batang.rotation.z = 0.15;
  g.add(batang);
  for (let i = 0; i < 6; i++) {
    const daun = mesh(new THREE.BoxGeometry(1.6, 0.05, 0.35), 0x3aa76d, 0, 2.4, 0);
    daun.rotation.y = (i / 6) * Math.PI * 2;
    daun.rotation.z = -0.35;
    daun.translateX(0.7);
    g.add(daun);
  }
  g.position.set(x, 0, z);
  return g;
}

// --------------------------------------------------------------- bangunan pos
const BANGUNAN = {
  gerbang() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(0.6, 2.4, 0.6), 0x8d8d8d, -1, 1.2, 0));
    g.add(mesh(new THREE.BoxGeometry(0.6, 2.4, 0.6), 0x8d8d8d, 1, 1.2, 0));
    g.add(mesh(new THREE.BoxGeometry(3, 0.5, 0.8), 0x6f6f6f, 0, 2.6, 0));
    g.add(mesh(new THREE.BoxGeometry(0.5, 0.5, 0.2), 0xf5b301, 0, 2.6, 0.45));
    return g;
  },
  jembatan() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(1.6, 0.06, 8), 0x3b8fd9, 0, 0.03, 0));
    g.add(mesh(new THREE.BoxGeometry(2.6, 0.18, 1.2), 0x9b6b3a, 0, 0.35, 0));
    for (const x of [-1.2, 1.2]) {
      g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.2, 6), 0x7a5420, x, 0.9, -0.5));
      g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.2, 6), 0x7a5420, x, 0.9, 0.5));
    }
    // timbangan kecil di tiang
    g.add(mesh(new THREE.BoxGeometry(1.8, 0.08, 0.08), 0xf5b301, 0, 1.9, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10), 0xf5b301, -0.9, 1.6, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10), 0xf5b301, 0.9, 1.6, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.9, 6), 0x7a5420, 0, 0.95, 0));
    g.rotation.y = 0.3;
    return g;
  },
  sungai() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.06, 20), 0x3b8fd9, 0, 0.03, 0));
    [[-1.4, 0.6], [-0.4, -0.3], [0.6, 0.5], [1.5, -0.4]].forEach(([x, z]) => {
      const b = mesh(new THREE.DodecahedronGeometry(0.42, 0), 0x9a9a9a, x, 0.15, z);
      b.scale.y = 0.45;
      g.add(b);
    });
    return g;
  },
  gua() {
    const g = new THREE.Group();
    const bukit = mesh(new THREE.DodecahedronGeometry(2.6, 0), 0x6d6a73, 0, 0.8, 0);
    bukit.scale.set(1.1, 0.8, 1);
    g.add(bukit);
    const pintu = mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 12, 1, false, 0, Math.PI), 0x1c1a20, 0, 0.1, 2.3);
    pintu.rotation.x = Math.PI / 2;
    pintu.rotation.z = Math.PI / 2;
    g.add(pintu);
    const cermin = mesh(new THREE.BoxGeometry(0.7, 1, 0.05), 0xcfe8ff, 1.5, 1.2, 2.1);
    g.add(cermin);
    return g;
  },
  pasar() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(2, 0.8, 1), 0xb5762f, 0, 0.4, 0));
    for (const [x, z] of [[-0.9, -0.45], [0.9, -0.45], [-0.9, 0.45], [0.9, 0.45]]) {
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 5), 0x7a5420, x, 0.9, z));
    }
    g.add(mesh(new THREE.ConeGeometry(1.6, 0.9, 4), 0xe5603b, 0, 2.2, 0));
    g.children.at(-1).rotation.y = Math.PI / 4;
    for (let i = 0; i < 4; i++) g.add(mesh(new THREE.CapsuleGeometry(0.08, 0.35, 2, 6), 0xf5d33a, -0.6 + i * 0.4, 0.9, 0));
    const perahu = mesh(new THREE.BoxGeometry(1.8, 0.35, 0.7), 0x8a5a2b, 1.8, 0.2, 1.4);
    perahu.rotation.y = 0.5;
    g.add(perahu);
    return g;
  },
  bukit() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.ConeGeometry(3, 3.2, 8), 0x4f9d4a, 0, 1.6, -1.5));
    g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), 0x7a5420, 0, 0.9, 1.2));
    const a = mesh(new THREE.BoxGeometry(1.1, 0.3, 0.08), 0xf2e4c4, 0.45, 1.5, 1.2);
    const b = mesh(new THREE.BoxGeometry(1.1, 0.3, 0.08), 0xf2e4c4, -0.45, 1.1, 1.2);
    g.add(a, b);
    return g;
  },
  dermaga() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(1.2, 0.15, 4), 0x9b6b3a, 0, 0.3, -1.5));
    for (const z of [-3.2, -1.5, 0.2]) {
      g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 5), 0x6b4a24, -0.6, 0.1, z));
      g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 5), 0x6b4a24, 0.6, 0.1, z));
    }
    const rakit = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const kayu = mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.8, 6), 0xb5884d, -0.64 + i * 0.32, 0.12, 0);
      kayu.rotation.x = Math.PI / 2;
      rakit.add(kayu);
    }
    rakit.position.set(1.6, 0, -3.6);
    g.add(rakit);
    return g;
  },
};

function peti() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(1.4, 0.8, 0.9), 0x8a5a2b, 0, 0.4, 0));
  g.add(mesh(new THREE.BoxGeometry(1.45, 0.12, 0.95), 0xf5b301, 0, 0.55, 0));
  const engsel = new THREE.Group();
  engsel.position.set(0, 0.8, -0.45);
  const tutup = mesh(new THREE.BoxGeometry(1.4, 0.35, 0.9), 0x9c6a35, 0, 0.17, 0.45);
  engsel.add(tutup);
  engsel.add(mesh(new THREE.BoxGeometry(0.25, 0.25, 0.08), 0xf5b301, 0, 0.1, 0.92));
  g.add(engsel);
  const koin = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const k = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 10), 0xffd23f, (i % 3 - 1) * 0.35, 0.7, (Math.floor(i / 3) - 1) * 0.22);
    k.rotation.x = Math.PI / 2;
    koin.add(k);
  }
  koin.visible = false;
  g.add(koin);
  return { g, engsel, koin };
}

function karakter() {
  const g = new THREE.Group();
  const ulfa = new THREE.Group();
  ulfa.add(mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.8, 8), 0xc9893b, 0, 0.55, 0));
  ulfa.add(mesh(new THREE.ConeGeometry(0.42, 0.45, 10), 0x2f9e8f, 0, 1.05, 0));
  ulfa.add(mesh(new THREE.SphereGeometry(0.3, 10, 8), 0x2f9e8f, 0, 1.35, 0));
  ulfa.add(mesh(new THREE.SphereGeometry(0.2, 10, 8), 0xe8b48a, 0, 1.33, 0.14));
  ulfa.add(mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.05, 12), 0xa8742f, 0, 1.6, 0));
  ulfa.add(mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.25, 10), 0xc9893b, 0, 1.73, 0));
  for (const x of [-0.07, 0.07]) ulfa.add(mesh(new THREE.SphereGeometry(0.03, 6, 4), 0x2b1b10, x, 1.36, 0.32));
  for (const x of [-0.12, 0.12]) ulfa.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.3, 6), 0x5a4632, x, 0.1, 0));
  g.add(ulfa);
  // Lino si tarsius di bahu
  const lino = new THREE.Group();
  lino.add(mesh(new THREE.SphereGeometry(0.17, 10, 8), 0xa07a50, 0, 0, 0));
  for (const x of [-0.07, 0.07]) {
    lino.add(mesh(new THREE.SphereGeometry(0.065, 8, 6), 0xd99a1e, x, 0.03, 0.13));
    lino.add(mesh(new THREE.SphereGeometry(0.035, 6, 4), 0x1d130b, x, 0.03, 0.18));
    lino.add(mesh(new THREE.SphereGeometry(0.07, 6, 4), 0x8a6440, x * 2.3, 0.14, 0));
  }
  lino.position.set(0.38, 1.05, 0);
  g.add(lino);
  g.scale.setScalar(1.6);
  return g;
}

function labelPos(teks, warna) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const k = c.getContext('2d');
  k.fillStyle = warna;
  k.beginPath(); k.arc(64, 64, 56, 0, Math.PI * 2); k.fill();
  k.lineWidth = 8; k.strokeStyle = '#ffffff'; k.stroke();
  k.fillStyle = '#ffffff';
  k.font = 'bold 60px sans-serif';
  k.textAlign = 'center'; k.textBaseline = 'middle';
  k.fillText(teks, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.scale.set(1.3, 1.3, 1);
  sp.renderOrder = 10;
  return sp;
}

/**
 * Membuat dunia 3D di dalam `wadah`.
 * @returns {Promise<null | {pindahKe, ikuti, lihatSemua, bukaPeti, perbaruiLabel, hapus}>}
 */
export async function buatDunia(wadah, { daftarPos, posAktif, selesai, diTitik, onPilihPos, fokusHarta = false }) {
  if (!dukungWebGL()) return null;
  await muatThree();
  const kurangGerak = gerakDikurangi();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'kanvas-3d';
  wadah.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fd3ff);
  scene.fog = new THREE.Fog(0x8fd3ff, 60, 110);
  const kamera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5a7a4a, 1.1));
  const matahari = new THREE.DirectionalLight(0xfff3d6, 1.4);
  matahari.position.set(15, 25, 10);
  scene.add(matahari);

  // laut & pulau
  const laut = mesh(new THREE.CircleGeometry(120, 32), 0x2f86c9, 0, -0.05, 0);
  laut.rotation.x = -Math.PI / 2;
  scene.add(laut);
  const pulau = mesh(new THREE.CylinderGeometry(19, 21, 1.2, 24), 0x5cc84a, 0, -0.6, 0);
  scene.add(pulau);
  scene.add(mesh(new THREE.CylinderGeometry(21.2, 22, 0.3, 24), 0xeed9a4, 0, -0.9, 0));
  const pulauHarta = mesh(new THREE.CylinderGeometry(4, 4.6, 1.2, 14), 0xeed9a4, 10, -0.6, -21);
  scene.add(pulauHarta);
  scene.add(kelapa(6.6, -22.4), kelapa(12.8, -24));

  // jalan setapak
  const titik = JALAN.map(([x, z]) => new THREE.Vector3(x, 0.05, z));
  const kurva = new THREE.CatmullRomCurve3(titik, false, 'catmullrom', 0.3);
  const jalurDarat = new THREE.CatmullRomCurve3(titik.slice(0, 8), false, 'catmullrom', 0.3);
  const tabung = new THREE.Mesh(new THREE.TubeGeometry(jalurDarat, 160, 0.45, 6, false), bahan(0xe9cf94));
  tabung.scale.y = 0.15;
  scene.add(tabung);

  // pepohonan dekorasi (posisi tetap agar konsisten)
  [[-16, 4], [-14, -2], [-12, -12], [-8, 15], [0, 15], [7, 13], [13, 8], [15, -2], [13, -9], [-2, 1], [0, -10],
    [-16, 9], [8, 12], [-10, 1], [16, 4], [-3, -15]].forEach(([x, z], i) => scene.add(pohon(x, z, 0.8 + (i % 3) * 0.2)));

  // bunga warna-warni
  const warnaBunga = [0xff6f59, 0xffc93c, 0xc084fc, 0xff8fc7, 0xffffff];
  [[-12, 10], [-6, 12], [1, 12.5], [7, 9.5], [12, 4], [8, -2], [2, -7], [-9, -2], [-13, -7], [-1, -12], [-4, 4], [11, -6]]
    .forEach(([x, z], i) => {
      for (let j = 0; j < 4; j++) {
        const a = (j / 4) * Math.PI * 2 + i;
        const bx = x + Math.cos(a) * 0.7;
        const bz = z + Math.sin(a) * 0.7;
        scene.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4), 0x2e8b57, bx, 0.2, bz));
        scene.add(mesh(new THREE.SphereGeometry(0.17, 6, 4), warnaBunga[(i + j) % warnaBunga.length], bx, 0.45, bz));
      }
    });
  // awan
  [[-18, 14, -30], [6, 16, -40], [24, 13, -18], [-26, 15, -8]].forEach(([x, y, z]) => {
    const awan = new THREE.Group();
    [[0, 0, 0, 2.2], [1.9, -0.3, 0.2, 1.6], [-1.9, -0.4, 0, 1.5], [0.8, 0.9, 0, 1.4]].forEach(([dx, dy, dz, r]) => {
      awan.add(new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshLambertMaterial({ color: 0xffffff })).translateX(dx).translateY(dy).translateZ(dz));
    });
    awan.position.set(x, y, z);
    scene.add(awan);
  });
  // pelangi
  [0xff6f59, 0xffa94d, 0xffd43b, 0x69db7c, 0x4dabf7, 0x9775fa].forEach((warna, i) => {
    const busur = new THREE.Mesh(new THREE.TorusGeometry(26 - i * 0.9, 0.45, 6, 40, Math.PI), new THREE.MeshBasicMaterial({ color: warna }));
    busur.position.set(0, -2, -48);
    scene.add(busur);
  });

  // bangunan pos
  const pilihan = [];
  const label = [];
  daftarPos.forEach((p, i) => {
    const [x, z] = JALAN[TITIK_POS[i]];
    const b = BANGUNAN[p.id] ? BANGUNAN[p.id]() : new THREE.Group();
    const geser = { gerbang: [0, -1.5], jembatan: [0, 0], sungai: [0, 0], gua: [2.5, -2], pasar: [2.2, 1.6], bukit: [-1.5, -2], dermaga: [1.5, -1] }[p.id] || [0, 0];
    b.position.set(x + geser[0], 0, z + geser[1]);
    b.traverse((o) => { o.userData.pos = i; });
    scene.add(b);
    pilihan.push(b);
  });
  const { g: petiG, engsel, koin } = peti();
  petiG.position.set(11.6, 0, -22.2);
  petiG.rotation.y = 0.35;
  scene.add(petiG);

  function perbaruiLabel(aktif, sudah) {
    label.forEach((l) => scene.remove(l));
    label.length = 0;
    daftarPos.forEach((p, i) => {
      const [x, z] = JALAN[TITIK_POS[i]];
      const warna = sudah.has(p.id) ? '#1a7f37' : i === aktif ? '#e59a00' : '#8a94a3';
      const sp = labelPos(sudah.has(p.id) ? '✓' : String(i + 1), warna);
      sp.position.set(x, 4.2, z);
      sp.userData.pos = i;
      sp.userData.aktif = i === aktif;
      scene.add(sp);
      label.push(sp);
    });
  }
  perbaruiLabel(posAktif, selesai);

  // karakter
  const tokoh = karakter();
  scene.add(tokoh);
  let tAktif = diTitik / (JALAN.length - 1);
  function taruh(t) {
    const p = kurva.getPoint(t);
    tokoh.position.set(p.x, 0.05, p.z);
    const arah = kurva.getTangent(Math.min(t + 0.001, 1));
    tokoh.rotation.y = Math.atan2(arah.x, arah.z);
  }
  taruh(tAktif);

  // kamera
  let mode = fokusHarta ? 'harta' : 'ikuti';
  const target = new THREE.Vector3();
  const posKamera = new THREE.Vector3();
  function sasaranKamera() {
    if (mode === 'semua') { target.set(0, 0, -3); posKamera.set(0, 46, 22); return; }
    if (mode === 'harta') { target.set(11, 0.7, -21.6); posKamera.set(15.5, 5.5, -15.5); return; }
    target.copy(tokoh.position);
    posKamera.set(tokoh.position.x + 4, 10, tokoh.position.z + 10);
  }
  sasaranKamera();
  kamera.position.copy(posKamera);
  kamera.lookAt(target);

  // ukuran
  function ubahUkuran() {
    const w = wadah.clientWidth || 360;
    const hgt = wadah.clientHeight || 300;
    renderer.setSize(w, hgt, false);
    kamera.aspect = w / hgt;
    kamera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(ubahUkuran);
  ro.observe(wadah);
  ubahUkuran();

  // klik / ketuk pos
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let mulaiKetuk = null;
  const kanvas = renderer.domElement;
  kanvas.addEventListener('pointerdown', (e) => { mulaiKetuk = [e.clientX, e.clientY]; });
  kanvas.addEventListener('pointerup', (e) => {
    if (!mulaiKetuk || Math.hypot(e.clientX - mulaiKetuk[0], e.clientY - mulaiKetuk[1]) > 8) return;
    const r = kanvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, kamera);
    const kena = ray.intersectObjects([...pilihan, ...label], true)[0];
    if (kena && Number.isInteger(kena.object.userData.pos)) onPilihPos?.(kena.object.userData.pos);
  });

  // animasi
  let gerak = null; // {dari, ke, mulai, durasi, selesai}
  let animPeti = null;
  let berjalan = true;
  let terakhir = 0;
  function bingkai(waktu) {
    if (!berjalan) return;
    requestAnimationFrame(bingkai);
    if (document.hidden || waktu - terakhir < 1000 / 40) return;
    terakhir = waktu;
    const dt = 1;
    if (gerak) {
      const p = Math.min(1, (waktu - gerak.mulai) / gerak.durasi);
      const halus = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      tAktif = gerak.dari + (gerak.ke - gerak.dari) * halus;
      taruh(tAktif);
      const lompat = Math.abs(Math.sin(p * Math.PI * gerak.lompatan));
      tokoh.position.y = 0.05 + lompat * 0.35;
      const indeksLompat = Math.floor(p * gerak.lompatan);
      if (indeksLompat !== gerak.terakhirLompat) { gerak.terakhirLompat = indeksLompat; efek('langkah'); }
      if (p >= 1) { const s = gerak.selesai; gerak = null; tokoh.position.y = 0.05; s?.(); }
    }
    if (animPeti) {
      const p = Math.min(1, (waktu - animPeti.mulai) / 1400);
      engsel.rotation.x = -1.9 * (1 - (1 - p) ** 3);
      koin.visible = p > 0.3;
      koin.position.y = Math.max(0, p - 0.3) * 0.9;
      koin.rotation.y = waktu / 500;
      if (p >= 1) { const s = animPeti.selesai; animPeti = null; s?.(); }
    }
    for (const l of label) {
      if (l.userData.aktif && !kurangGerak) l.position.y = 4.2 + Math.sin(waktu / 350) * 0.25;
    }
    sasaranKamera();
    if (kurangGerak) {
      kamera.position.copy(posKamera);
    } else {
      kamera.position.lerp(posKamera, 0.08 * dt);
    }
    kamera.lookAt(target);
    renderer.render(scene, kamera);
  }
  requestAnimationFrame(bingkai);

  return {
    /** Ulfa berjalan ke titik jalan `keTitik`. */
    pindahKe(keTitik, selesaiCb) {
      const ke = keTitik / (JALAN.length - 1);
      if (kurangGerak) { tAktif = ke; taruh(ke); selesaiCb?.(); return; }
      const jarakTitik = Math.abs(ke - tAktif) * (JALAN.length - 1);
      // Perjalanan jauh dipercepat (maks ±4 detik) agar siswa tidak menunggu lama.
      const durasi = 1300 * Math.min(3, Math.max(1, jarakTitik));
      gerak = { dari: tAktif, ke, mulai: performance.now(), durasi, lompatan: Math.max(4, Math.round(durasi / 220)), terakhirLompat: -1, selesai: selesaiCb };
    },
    ikuti() { mode = 'ikuti'; },
    lihatSemua() { mode = 'semua'; },
    lihatHarta() { mode = 'harta'; },
    bukaPeti(selesaiCb) {
      mode = 'harta';
      if (kurangGerak) { engsel.rotation.x = -1.9; koin.visible = true; selesaiCb?.(); return; }
      animPeti = { mulai: performance.now(), selesai: selesaiCb };
    },
    perbaruiLabel,
    hapus() {
      berjalan = false;
      ro.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) { o.material.map?.dispose(); o.material.dispose(); }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
