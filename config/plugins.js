// const path = require("path");

// module.exports = ({ env }) => ({
//     upload: {
//         config: {
//             provider: "aws-s3",
//             providerOptions: {
//                 baseUrl: env("MINIO_PUBLIC_ENDPOINT"),
//                 s3Options: {
//                     credentials: {
//                         accessKeyId: env("MINIO_ACCESS_KEY"),
//                         secretAccessKey: env("MINIO_SECRET_KEY"),
//                     },
//                     endpoint: env("MINIO_PRIVATE_ENDPOINT"),
//                     region: env("MINIO_REGION"),
//                     forcePathStyle: true,
//                     params: {
//                         Bucket: env("MINIO_BUCKET_NAME"),
//                     },
//                 },
//             },
//         },
//     },
// });
module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: "aws-s3-provider",
            providerOptions: {
                baseUrl: env("MINIO_PUBLIC_ENDPOINT"),
                s3Options: {
                    credentials: {
                        accessKeyId: env("MINIO_ACCESS_KEY"),
                        secretAccessKey: env("MINIO_SECRET_KEY"),
                    },
                    endpoint: env("MINIO_PRIVATE_ENDPOINT"),
                    region: env("MINIO_REGION"),
                    forcePathStyle: true,
                    params: {
                        Bucket: env("MINIO_BUCKET_NAME"),
                    },
                },
            },
        },
    },
});

