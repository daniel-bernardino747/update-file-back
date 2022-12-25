import aws from 'aws-sdk'; //new
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer'; //new
import multerS3 from 'multer-s3'; //new
import path from 'path';

dotenv.config()
const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve('_dirname', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      })
    } // define o nome da imagem que vai ser salvada
  }),
  s3: multerS3({
    s3: new aws.S3(), // já defini as variáveis de ambiente
    bucket: 'upload-files-dan-devlops',
    contentType: multerS3.AUTO_CONTENT_TYPE, //vai abrir o arquivo em tela
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      })
    }
  })
}
export default {
  dest: path.resolve('_dirname', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjeg',
      'image/png',
      'image/gif'
    ]; //formatos que aceito na aplicação

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); //primeiro parametro são erros
    } else {
      cb(new Error('Invalid file type.'))
    }
  }
}