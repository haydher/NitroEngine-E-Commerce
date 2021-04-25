const dotenv = require("dotenv").config()
const S3 = require("aws-sdk/clients/s3")
const fs = require("fs")

const bucketName = process.env.AWS_NAME
const region = process.env.AWS_REGION
const accessKeyId =  process.env.AWS_ACCESS_KEY_ID
const secreteAccessKey =  process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
 region,
 accessKeyId,
 secreteAccessKey,
})

// upload file to s3
function uploadFile(file){
 const fileStream = fs.createReadStream(file.path)
 const uploadParams = {
  Bucket: bucketName,
  Body: fileStream,
  Key: file.filename,
 }
 return s3.upload(uploadParams).promise()
}
// download the file
function downloadImgFromS3(fileKey){
 const downloadParams = {
  Key: fileKey,
  Bucket: bucketName
 }
 return s3.getObject(downloadParams).createReadStream()
}

// delete a file 
function deleteImg(fileKey){
 const deleteParam = {
  Key: fileKey,
  Bucket: bucketName
 }
 return s3.deleteObject(deleteParam).promise();
}

module.exports.uploadFile = uploadFile
module.exports.downloadImgFromS3 = downloadImgFromS3
module.exports.deleteImg = deleteImg