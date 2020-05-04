module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },

  transpileDependencies: ['quasar'],
}
