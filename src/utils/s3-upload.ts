// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// const s3 = new S3Client({
//   region: 'your-region', // e.g., 'us-east-1'
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
//   }
// });

// export async function uploadPDF(pdfBlob) {
//   const fileName = `designs/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
  
//   await s3.send(new PutObjectCommand({
//     Bucket: 'your-bucket-name',
//     Key: fileName,
//     Body: pdfBlob,
//     ContentType: 'application/pdf'
//   }));

//   // Generate a shareable URL (expires in 7 days)
//   const url = await getSignedUrl(s3, new GetObjectCommand({
//     Bucket: 'your-bucket-name',
//     Key: fileName
//   }), { expiresIn: 604800 });

//   return url;
// }