import type { NextConfig } from "next";
// @ts-ignore - next-pwa no tiene tipos oficiales
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Añadir configuración vacía de Turbopack para silenciar la advertencia
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
