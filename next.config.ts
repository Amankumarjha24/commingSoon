import type { NextConfig } from "next";
import fs from "fs";

// Node.js 24 on Windows EISDIR fix
const origReadlink = fs.readlink.bind(fs);
const origReadlinkSync = fs.readlinkSync.bind(fs);
// @ts-ignore
fs.readlink = function(path: any, options: any, callback: any) {
  if (typeof options === "function") { callback = options; options = {}; }
  origReadlink(path, options, (err: any, linkString: any) => {
    if (err && err.code === "EISDIR") {
      const e = Object.assign(new Error(err.message), { code: "EINVAL" });
      return callback(e);
    }
    callback(err, linkString);
  });
};
// @ts-ignore
fs.readlinkSync = function(path: any, options: any) {
  try { return origReadlinkSync(path, options); }
  catch (err: any) {
    if (err.code === "EISDIR") throw Object.assign(new Error(err.message), { code: "EINVAL" });
    throw err;
  }
};

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.toolsfortools.in',
          },
        ],
        destination: 'https://toolsfortools.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
