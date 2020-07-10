const express = require('express');
const posts = require("../posts/postDb");
const router = express.Router();

router.get('/', (req, res) => {
  posts.get()

  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "can not find posts"})
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  posts.remove(req.params.id)

  .then (count => {
    if(count > 0) {
      res.status(200).json({message: "post has been deleted"})
    } else {
      res.status(404).json({ errorMessage: " post can not be found"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "can not delete post"})
  })
});

router.put('/:id', validatePostId, (req, res) => {
  posts.update(req.params.id, req.body)

  .then(post => {
    if(post) {
      res.status(200).json(post)
    } else if (!req.body.text) {
      res.status(400).json({errorMessage: "missing required text field"})
    } else {
      res.status(404).json({ errorMessage: "post does not exist"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({errorMessage: "can not update post"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const {id} = req.params.id
  
  posts.getById(id)
    .then (post => {
      req.post = post
      next()
    })
    .catch (err => {
      console.log (err)
      res.status(400).json ({ message: "invalid post id"})
    })
}

module.exports = router;
