({
    appDir: "../",
    baseUrl: "js",
    dir: "../dist",
    modules: [
        {
            name: "app"
        }
    ],
    paths: {
        jquery: "empty:",
        hammerjs: "empty:",
        underscorejs: "empty:",
        d3js: "empty:"
    },
    optimize: "uglify2",
    fileExclusionRegExp: /^(.*\.md|node_modules|\.git.*|\.git)/,
})
