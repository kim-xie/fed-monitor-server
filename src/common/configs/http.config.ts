export default () => ({
  // http 请求大小限制200kb
  http: {
    request: {
      body: {
        limit: '200kb',
      },
    },
  },
});
