const router = require('express').Router()
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

router.post('/', async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id 
        });
        res.status(200).json({post, message : `Post Created`})
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        
    const updatePost = await Post.update(req.body, { 
        where : { id: req.params.id } }); 

        res.status(200).json(updatePost);
        
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


router.delete('/:id', async (req, res) => {
    try { 
        const deletePost = await Post.destroy({ where: {id : req.params.id}});
        res.status(200).json(deletePost)
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router