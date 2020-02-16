const configFactory = require("../webpack/webpackConfigFactory");
const { ContainerReferencePlugin } = require("../../");

const siteId = 1;

module.exports = configFactory(siteId, {
  plugins: [
    new ContainerReferencePlugin({
      remotesType: "var",
      remotes: ["websiteTwo"],
      override: {
        react: "react"
      }
    })
  ]
});
