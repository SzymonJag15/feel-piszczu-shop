const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");

module.exports = withImages({
  target: "serverless",
  images: {
    disableStaticImages: true,
  },
});
