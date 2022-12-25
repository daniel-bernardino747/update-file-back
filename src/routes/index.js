import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer.js';

import Post from '../models/Post.js';

const routes = express.Router();

routes.get('/files', async (req, res) => {
  try {
    const posts = await Post.find()
  
    return res.status(200).send(posts)
  } catch (err) {
    return res.status(500).send({error: err})
  }
})

routes.post('/files', multer(multerConfig).single('file'), async (req, res) => {
  const { originalname: name, size, key, location: url = '' } = req.file;
  console.log('file', req.file)

  try {
    const post = await Post.create({
      name,
      size,
      key,
      url
    })
  
    return res.status(201).send({message: post});
  } catch (err) {
    return res.status(500).send({error: err});
  }
});

routes.delete('/files/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    await post.remove();

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
})

export default routes;