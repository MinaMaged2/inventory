const express = require('express');
const router = new express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');

router.post('/createUser', async (req, res)=> {

    const name = req.body.name;
    const password = req.body.password;
    const type = req.body.type;

    if(!name || !password || !type){
        throw new Error ("missing_data");
    }
    const user = new User({name, password, type});
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})

    } catch (e) {
        if(e.code === 11000){
            res.status(400).send({error: 'المستخدم موجود من قبل'});
        }else if(e.message === 'missing_data'){
          res.status(400).send({ error: "برجاء ادخال جميع البيانات المطلوبة" });
        }else{
            console.log(e)
            res.status(400).send({ error: "حدث خطء"});
        }
        
    }
});


router.post('/login', async (req, res)=> {
    const name = req.body.name;
    const password = req.body.password;

    if(!name || !password){
        throw new Error ("missing_data");
    }
    
    try {
        
        const user = await User.findByCredentials(req.body.name, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})


    } catch (e) {
        if(e.message === 'missing_data'){
            res.status(400).send({ error: "برجاء ادخال جميع البيانات المطلوبة" });
        }else{
            console.log(e)
            res.status(400).send({error:'الاسم او كلمة السر خطء'})
        }
        
    }
});


router.post('/updateUser', auth, async (req, res)=> {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'type'];
    const isValidUpdates = updates.every( (update)=> allowedUpdates.includes(update));

    if(!isValidUpdates){
        throw new Error('Invalid_updates')
        
    }
    try {
        updates.forEach( (update)=> {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        if(e.message === 'Invalid_updates'){
            res.status(400).send({error: 'تعديلات غير صحيحة'})
        }else{
            console.log(e);
            res.status(400).send({ error: "حدث خطء"});
        }
    }
});

router.post('/logout', auth ,async (req, res)=> {

    try {
        req.user.token = null;
        await req.user.save();
        res.status(200).send()
     } catch (e) {
        console.log(e)
        res.status(400).send({ error: "حدث خطء"});
      }
 
});


// get all users
router.get("/users", auth ,async (req, res) => {
  try {
    const users = await User.find({"type": {"$ne": 'admin'}}).sort({'name': 1});
    res.status(200).send({ users });
  } catch (e) {
    res.status(400).send({ error: "حدث خطء"});
  }
});

module.exports = router
