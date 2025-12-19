/** @type {import('next').NextConfig} */
// GitHub Pages 정적 배포용 설정
// - Actions에서 BASE_PATH를 "/<repo>" 로 넣어주면 repo 하위로 정상 동작합니다.
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};

module.exports = nextConfig;
