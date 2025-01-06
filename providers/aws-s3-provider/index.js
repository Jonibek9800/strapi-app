const AWS = require("aws-sdk");

module.exports = {
    init: (config) => {
        // Инициализация клиента S3/MinIO

        const s3 = new AWS.S3({
            endpoint: config.s3Options.endpoint, // URL MinIO сервера
            accessKeyId: config.s3Options.credentials.accessKeyId, // Ключ доступа
            secretAccessKey: config.s3Options.credentials.secretAccessKey, // Секретный ключ
            region: config.s3Options.region || "us-east-1", // Регион (по умолчанию)
            s3ForcePathStyle: true, // Требуется для MinIO
            signatureVersion: "v4", // Используемая версия подписи
        });
        const filePrefix = config.rootPath ? `${config.rootPath.replace(/\/+$/, "")}/` : "";

        const getFileKey = (/** @type {{ path: any; hash: any; ext: any; }} */ file) => {
            const path = file.path ? `${file.path}/` : "";
            return `${filePrefix}${path}${file.hash}${file.ext}`;
        };

        return {
            async upload(file) {
                const fileKey = getFileKey(file);
                // try {
                const params = {
                    Bucket: config.s3Options.params.Bucket,
                    Key: fileKey, // Имя файла в хранилище
                    Body: file.buffer, // Содержимое файла
                    ContentType: file.mimetype, // MIME-тип файла
                };

                const data = await s3.upload(params).promise();
                console.log("url:", data);
                return {
                    url: data.Location,
                };
                // } catch (err) {
                //     throw new Error(`Upload failed: ${err.message}`);
                // }
            },

            async delete(file) {
                const fileKey = getFileKey(file);
                try {
                    const params = {
                        Bucket: config.s3Options.params.Bucket,
                        Key: fileKey, // Имя файла в хранилище
                    };

                    await s3.deleteObject(params).promise();
                    return {
                        success: true,
                    };
                } catch (err) {
                    throw new Error(`Delete failed: ${err.message}`);
                }
            },

            async isPrivate() {
                return true; // Указываем, что хранилище приватное
            },

            async getSignedUrl(file) {
                const fileKey = getFileKey(file);

                // try {
                // if (
                //     !file ||
                //     !file.formats ||
                //     !file.formats.thumbnail ||
                //     !file.formats.thumbnail.path
                // ) {
                //     throw new Error("Invalid file format or missing path.");
                // }

  
                const params = {
                    Bucket: config.s3Options.params.Bucket,
                    Prefix: fileKey, 
                };

                const data = await s3.listObjectsV2(params).promise();

                if (data.Contents.length === 0) {
                    console.log("Бакет пуст или объект не найден.");
                    return { url: null }; 
                }
                const fileType = file.mime || "image/jpeg";

            
                const signedUrlParams = {
                    Bucket: config.s3Options.params.Bucket,
                    Key: fileKey, // Путь к файлу
                    Expires: 60,
                    ResponseContentDisposition: "inline",
                    ResponseContentType: fileType, 
                };

                const signedUrl = await s3.getSignedUrlPromise("getObject", signedUrlParams);
                console.log("url:", signedUrl);
                return { url: signedUrl };
                // } catch (err) {
                //     console.error("Error generating signed URL:", err);
                //     throw new Error(`Get signed URL failed: ${err.message}`);
                // }
            },
        };
    },
};
