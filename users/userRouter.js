const express = require('express');
const users = require("./userDb")
const posts = require("../posts/postDb")
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  users.insert(req.body)

  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({errorMessage: "failed to add new user"})
  })
  
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  posts.insert(req.body)

  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({errorMessage: "failed to add new post"})
  })
});

router.get('/', (req, res) => {
  users.get()

  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "can not find users"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  users.getUserPosts()

  .then(userPosts => {
    res.status(200).json(userPosts)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "can not find user's posts"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  users.remove(req.params.id)

  .then (count => {
    if(count > 0) {
      res.status(200).json({message: "user has been deleted"})
    } else {
      res.status(404).json({ errorMessage: " user can not be found"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "can not delete user"})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  users.update(req.params.id, req.body)

  .then(user => {
    if(user) {
      res.status(200).json(user)
    } else if (!req.body.name) {
      res.status(400).json({errorMessage: "missing required name field"})
    } else {
      res.status(404).json({ errorMessage: "user does not exist"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({errorMessage: "can not update user"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params.id
  
  users.getById(id)
    .then (user => {
      req.user = user
      next()
    })
    .catch (err => {
      console.log (err)
      res.status(400).json ({ message: "invalid user id"})
    })
}

function validateUser(req, res, next) {
   if(req.body && req.body.name) {
     next()
   } else if (!req.body) {
     res.status (400).json({ message: "missing user data"})
   } else {
    res.status (400).json({ message: "missing required name field"})
   }
}

function validatePost(req, res, next) {
  if(req.body && req.body.text) {
    next()
  } else if (!req.body) {
    res.status (400).json({ message: "missing post data"})
  } else {
   res.status (400).json({ message: "missing required text field"})
  }
}

module.exports = router;
