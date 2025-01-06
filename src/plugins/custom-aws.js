const AWS = require("aws-sdk");

const index = {
    init(config) {
        const s3 = new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            endpoint: config.endpoint,
            region: config.region,
            s3ForcePathStyle: config.s3ForcePathStyle,
        });

        return {
            async upload(file) {
                const params = {
                    Bucket: config.bucket,
                    Key: file.hash + file.ext,
                    Body: file.stream || Buffer.from(file.buffer, "binary"),
                    ContentType: file.mime,
                };

                await s3.upload(params).promise();
                file.url = `/${params.Key}`; // Сохраните относительный путь
            },

            async delete(file) {
                const params = {
                    Bucket: config.bucket,
                    Key: file.hash + file.ext,
                };

                await s3.deleteObject(params).promise();
            },

            async get(file) {
                const params = {
                    Bucket: config.bucket,
                    Key: file.hash + file.ext,
                    Expires: 3600, // Действует 1 час
                };

                const signedUrl = s3.getSignedUrl("getObject", params);
                return signedUrl;
            },
        };
    },
};
module.exports = index;
//# sourceMappingURL=index.js.map
