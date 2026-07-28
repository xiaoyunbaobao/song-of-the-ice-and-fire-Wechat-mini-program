// 云存储图片路径工具
// 用法: getCloudImg('images/banner-timeline/xxx.jpg')
const CLOUD_ENV = 'cloud1-1g5ys3sne8db5912';

function getCloudImg(relativePath) {
  // 云存储 fileID 格式: cloud://env-id.xxx/path
  return `cloud://${CLOUD_ENV}.636c-${CLOUD_ENV}-1419585064/${relativePath}`;
}

module.exports = { getCloudImg, CLOUD_ENV };
