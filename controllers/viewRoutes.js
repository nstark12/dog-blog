const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');



router.get('/', withAuth, async (req, res) => {
  try {
    
    const postsPosted = await Post.findAll({
      include: [{ model: User }]
  })

  const posts = postsPosted.map((post) => post.get({ plain: true }))
  
  res.render('homepage', { posts, logged_in: req.session.logged_in })
} catch(err) {
  console.log(err)
  res.status(500).json(err)
}
});

router.get('/posts/:id', async (req, res) => {
  try {
    const postsPosted = await Post.findOne({
      where: {id: req.params.id},
      include: [
        User,
        {
          model: Comment,
          include: [User]
        }
      ]
    })

    let posts = postsPosted.get({ plain: true })

    res.render('post', {
      posts,
      logged_in: req.session.logged_in
    })

  } catch(err) {
    res.status(500).json(err)
  }
})

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// signup route
router.get('/signup', (req, res) => {
  try{
    if (req.session.loggedIn) {
      res.redirect('/')
      return
    }

    res.render('signup')
  } catch(err) {
    res.status(500).json(err)
  }
})

// profile route
router.get('/profile', async (req, res) => {
  const user_id = req.session.user_id

  if(!user_id) {
    res.redirect('/login')
  }

  try {
    const user = await User.findByPk(user_id, {
      raw: true
    })

    const posts = await Post.findAll({
      where: {
        user_id
      },
      raw: true
    })

    const comments = await Comment.findAll({
      where: {
        user_id
      },
      raw: true
    })
    res.render('profile', {...user, posts, comments, logged_in: req.session.logged_in})

  } catch(err) {
    res.status(500).json(err)
  }
})

router.get('/profile/:id', async (req, res) => {
  try{
      const post = await Post.findByPk(req.params.id, {
          include: [{
              model: Comment,
              include: {
                  model: User,
                  attributes: ['username']
              }
          },
          {
              model: User,
              attributes: ['username']
          }]
      })
      const editPost = post.get({
          raw: true
      })
      res.render('edit-delete', {
          editPost
      })
  } catch(err) {
      res.status(500).json(err)
  }
})

module.exports = router;
