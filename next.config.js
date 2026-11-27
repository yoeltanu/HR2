/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keamanan: matikan layanan /_next/image (celah pustaka pengolah gambar pada versi Next ini). Aplikasi tidak
  // memakai next/image; hapus baris ini hanya setelah Next di-upgrade.
  images: { unoptimized: true }
};

module.exports = nextConfig;
