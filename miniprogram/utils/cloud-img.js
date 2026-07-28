// CDN 直链工具
const CDN_BASE = 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/';

function getCloudImg(relativePath) {
  return CDN_BASE + relativePath;
}

module.exports = { getCloudImg };
