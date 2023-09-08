const router = require('express').Router
const { User, Post, Comment } = require('../../models')

router.get('/', async (req, res) => {
    try {
        const postedPosts = await Post.findAll({
            include: [
                {
                    model: Comment,
                    include: [{ model: User }]
                }
            ]
        })

        const posts = postedPosts.map((post) => post.get({ plain: true }))
        res.status(200).json({ posts })

    } catch(err) {
        res.status(500).json(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    include: [
                        { model: User }
                    ]
                }
            ]
        })
        const singlePost = post.get({ plain: true })
        res.status(200).json({singlePost})
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router