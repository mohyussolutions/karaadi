import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generatePresignedUrl = async (
  userId: string,
  contentType: string,
) => {
  const ext = contentType.split("/")[1] || "jpg";
  const key = `profiles/${userId}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );

  return {
    uploadUrl,
    fileKey: key,
    cloudFrontUrl: `${process.env.CLOUDFRONT_DOMAIN}/${key}`,
  };
};
