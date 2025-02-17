const fs = require("node:fs");
const bcrypt = require('bcrypt')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mime = require("mime");
const path = require('path');
const  GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session')
const passport = require('passport')
const { Upload} = require("@aws-sdk/lib-storage")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3');
const { group } = require("node:console");
const { Readable }  = require('stream');
const { finished } = require('stream/promises');



    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
const dir = "public/";
const port = 3001

const dburl = process.env.DB_URL;
const client = new MongoClient(dburl);
const S3 = new S3Client()

const app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
app.use(passport.initialize());
app.use(passport.session())
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log("HUHHHHHH")
    console.log(user)
    try {
      return cb(null, user);
    } catch(err) {
      return cb(err,null);
    }
  });
});


app.use((req,res,next) =>{
    req.time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, req.time);
    next();
});



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    const collection = client.db("a3").collection("users");
    const user = {
      id:         profile.id,
      username:   profile.username,
      photos:     profile.photos
    }
    const query = { id: user.id };
    const update = { $set: user};
    const options = { upsert: true };
    try {
      collection.updateOne(query, update, options);
      return cb(null, user);
    } catch(err) {
      return cb(err,false)
    }
  }
));

app.get('/api/auth/github', passport.authenticate('github'));

app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

checkAuthenticated = (req, res, next) => {
  console.log(req.isAuthenticated())
  console.log(req.user)
  if (req.isAuthenticated()) {
      next();
  } else {
    res.status(401).json({message:"not authenticated"})
  }
}

app.get("/api/auth/user",checkAuthenticated,async (req,res) => {
  res.json(req.user) // this is usesd to get session info out to user land
})




app.get("/api/groups",async (req,res) => {
  const collection = client.db("a3").collection("groups");
  const groups = (await collection.find({}).toArray())
  res.json(groups)
})

//checks if thumbnail is expired
app.post("/api/createGroup",checkAuthenticated,async (req,res)=> {
  const response_json = req.body;
    const collection = client.db("a3").collection("groups");
    const final_group_json = {
      group_name: response_json.group_name,
      description:response_json.description,
      owner: req.user,
      members:[req.user]
    }
  try {
    const results = await collection.insertOne(final_group_json)

    const newGroup = {
      _id:results.insertedId,
      ...final_group_json
    }
    res.json(newGroup)
  } catch {
    res.status(500).json({message:"failed to insert into db"})
  }
})

app.get("/api/group/:groupId/thumbnail",async (req,res) => {
  try {
    const collection = client.db("a3").collection("images");
    const image_data = await collection.findOne({
      group_id: req.params.groupId,
    });


    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.groupId,
    }
    const getObjectCommand = new GetObjectCommand(params);
    const { Body, ContentType } = await S3.send(getObjectCommand);
    if (!Body) {
      return res.status(404).send('Image not found in S3');
    }
    // Set the content type based on the S3 object's ContentType
    res.setHeader('Content-Type', ContentType || 'image/jpeg');
    // Pipe the S3 object's body (which is a Buffer) directly to the response
    if (Body instanceof Readable) {
      try {
        await finished(Body.pipe(res));
      } catch (error) {
        console.error('Error piping from S3:', error);
        res.status(500).send('Error streaming image from S3');
      }
    } else if (Body instanceof Buffer) {
      // Handle the case where Body is a Buffer
      const bufferStream = new Readable();
      bufferStream.push(Body);
      bufferStream.push(null); // Signal the end of the stream

      try {
        await finished(bufferStream.pipe(res));
      } catch (error) {
        console.error('Error piping from S3 (Buffer):', error);
        res.status(500).send('Error streaming image from S3');
      }
    } else {
      console.error('Unexpected Body type:', typeof Body);
      res.status(500).send('Unexpected data type from S3');
    }
  } catch(error) {
    fs.readFile("./default.png", (err, data) => {
      if (err) {
        console.error('Error reading the image:', err);
        return res.status(500).send('Error loading image');
      }

      // Set the content type to PNG
      res.writeHead(200, { 'Content-Type': 'image/png' });

      // Send the image data
      res.end(data);
    });
  }
})

app.post("/api/deleteGroup",checkAuthenticated,async (req,res) => {
  const collection = client.db("a3").collection("groups");
  console.log(req.body)
  const group = await collection.findOne({group_name: req.body.group_name})
  console.log(group)
  if(req.user.id != group.owner.id) {
    res.status(401).json({message:"not allowed to delete group"})
    return
  }
  const dbres = await collection.deleteOne(group)
  if(dbres.deletedCount !== 1) {
    res.status(500).json({message:"failed to delete"})
    return
  }
  res.json(await collection.find({}).toArray())
})


app.post("/api/editGroup",checkAuthenticated,async (req,res) => {
  const collection = client.db("a3").collection("groups");
  const group = await collection.findOne({ _id:new ObjectId(req.body._id) })
  if(req.user.id != group.owner.id) {
    res.status(401).json({message:"not allowed to delete group"})
    return
  }
  var myquery = { _id:new ObjectId(req.body._id) };
  var newvalues = { $set: {description: req.body.description, group_name: req.body.group_name} };
  const dbres = await collection.updateOne(myquery,newvalues)
  if(dbres.modifiedCount !== 1) {
    res.status(500).json({message:"failed to update"})
    return
  }
  res.json(await collection.find({}).toArray())
})


app.post("/api/clear",async (req,res) => {
  const collection = client.db("a3").collection("groups");
  await collection.deleteMany()
})


app.post("/api/join",checkAuthenticated,async (req,res) => {
    const collection = client.db("a3").collection("groups");
    const query = { _id:new ObjectId(req.body._id), }
  const update = { $push: { members: req.user } };
    const options = {};
    const result = await collection.updateOne(query, update, options);
    res.json(result)
})

const image_mimes = { type: 'image/*' }

app.put("/api/upload/:groupId",checkAuthenticated,express.raw(image_mimes),async (req,res) => {
  console.log(req.is('image/*') !== "image/png")
  if (req.is('image/*') !== "image/png" && req.is('image/*') !== "image/jpeg") {
    res.status(400).json({message:"not an image"})
    return
  }
  const upload = new Upload({
    params: {
        Bucket: process.env.BUCKET_NAME,
        Key: req.params.groupId,
        Body: req.body, // todo check if this is correct
      },
    client: S3,
    queueSize: 3,
  })
  upload.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });
  let error = false
  upload.on("httpError", (error) => {
    console.log("error")
    console.log(error);
    error = true;
  });
  await upload.done()
  if(error === true) {
    res.status(500).json({messsage:"failed to upload"})
  }
  const collection = client.db("a3").collection("images");
  collection.insertOne({
    group_id: req.params.groupId,
    mime_type:req.is(),
    bucket: process.env.BUCKET_NAME
  });
  res.status(200).json({
    status:true,
  });
})



if (client != undefined) {
  client.connect().then(async () => {
    console.log("Connected to database")
    //make sure all collections are created
    client.db("a3").collection("groups");
    client.db("a3").collection("users");
    client.db("a3").collection("messages");
    client.db("a3").collection("images");
  }).catch(err => {
    console.log(err)
  })
}

app.listen(process.env.PORT || port,() => {
  console.log("server running at http://localhost:"+port)
})
