module.exports = {
    attributes: {
      url: {
        type: 'string',
        configurable: false,
        get(url) {
          const signedUrl = strapi.plugins['upload'].provider.get({
            path: url, // Используйте путь файла
          });
  
          return signedUrl;
        },
      },
    },
  };
  