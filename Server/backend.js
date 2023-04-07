const express = require('express');
const app = express();
app.use('/', express.static("public"));
app.use('/api/', express.json());

const { MongoClient, ObjectId } = require('mongodb');
const GridFSBucket = require('mongodb').GridFSBucket;
const multer = require('multer');
const storage = multer.memoryStorage();

let cors = require("cors");
app.use(cors());

const uri = 'mongodb://127.0.0.1:27017/nexus?directConnection=true';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

try {
  client.connect();
} catch {
  console.log("ERROR CONNECTING TO MONGODB");
} finally {
  console.log('Connected to MongoDB');
  const db = client.db('nexus');
  const bucket = new GridFSBucket(db);
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 20,
      files: 10
    }
  }); 
  
  app.post('/api/upload', upload.array('files'), function (req, res, next) {
    console.log("=========================================ROUTE: /API/UPLOAD=============================================")
    const files = req.files;
    const users = req.body.uid;
    const tags = req.body.tags;
    const title = req.body.title;
    const desc = req.body.desc;
    let log = {};
    files.forEach(file => {
      console.log(`uploading ${file.originalname}... for the user(s) ${users}`);
      let fileTitle = !!(title) ? title : file.originalname;
      let { originalname, mimetype, buffer } = file;
      let uploadStream = bucket.openUploadStream(originalname, {
        metadata: { 
          contentType: mimetype,
          uid: users,
          tags: tags,
          title: fileTitle,
          desc: desc,
          likes: 0,
          comments: 0,
          views: 0
        }
      });
      uploadStream.end(buffer);
      uploadStream.on('finish', () => {
        log[`${file.originalname} status`] = "Upload successful!";
        console.log("uploaded file!");
      });
    });
    res.send(log);
    res.end();
  });
  
  app.get('/api/download/:filename', (req, res) => {
      const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
      downloadStream.pipe(res);
  });
  
  app.get('/api/get_filename/:filename', (req, res) => {
    console.log("=========================================ROUTE: /API/GET_FILENAME=============================================")
    const filename = req.params.filename;
    const query = { "filename": filename };
    const docs = [];
    let numdocs = 0;
    console.log(`searching for files with the name "${filename}"`);
    bucket.find(query).forEach(doc => {
      numdocs++;
      docs.push(doc);
    }).then(() => {
      console.log(`FOUND ${numdocs} DOCS`);
      res.send(docs);
      res.end();
    });
  });
  
  app.get('/api/get_fileID/:_id', async (req, res) => {
    console.log("=========================================ROUTE: /API/GET_FILE_ID=============================================")
    try {
      const downloadStream = bucket.openDownloadStream(new ObjectId(req.params._id));
      downloadStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error downloading file');
      res.end();
    }
  });

  app.get('/api/get_file_ref/:_id', (req, res) => {
    console.log("=========================================ROUTE: /API/GET_FILE_REF=============================================")
    const query = { _id: new ObjectId(req.params._id) };
    console.log("SEARCH QUERY:")
    console.log(query);
    bucket.find(query).forEach(doc => {
      console.log(`FOUND DOC`);
      res.send(doc);
      res.end();
      return;
    });
  });
  
  app.get('/api/get_files/:uid/:tags/:title/:desc', (req, res) => {
    console.log("=========================================ROUTE: /API/GET_FILES=============================================")
    const uid = req.params.uid;
    const tags = req.params.tags;
    const title = req.params.title;
    const desc = req.params.desc;
    const searches = [];
    if (uid != "__xXNULLXx__") searches.push({"metadata.uid": uid});
    if (tags != "__xXNULLXx__") searches.push({"metadata.tags": tags});
    if (title != "__xXNULLXx__") searches.push({"metadata.title": title});
    if (desc != "__xXNULLXx__") searches.push({"metadata.desc": desc});
    if (searches.length == 0) {
      res.send("no form data");
      console.log("no form data");
      res.end();
      return;
    }
    console.log("SEARCH QUERY:")
    console.log(searches);
    let numdocs = 0;
    let docs = [];
    const query = { 
                    $or: searches
                  };
    bucket.find(query).forEach(doc => {
      numdocs++;
      docs.push(doc);
    }).then(() => {
      console.log(`FOUND ${numdocs} DOCS`);
      console.log(docs);
      res.send(docs);
      res.end();
    });    
  });
  
  app.put('/api/update/:_id/:title/:desc/:tags', async (req, res) => {
    console.log("=========================================ROUTE: /API/UPDATE=============================================")
    const fileToUpdate = { _id: new ObjectId(req.params._id) };
    const file = await db.collection('fs.files').findOne({ _id: new ObjectId(req.params._id) })
    const old_metadata = file.metadata;
    const new_metadata =  { 
      contentType: old_metadata.contentType,
      uid: old_metadata.uid,
      tags: req.params.tags == "__xXNULLXx__" ? null : req.params.tags.split(","),
      title: req.params.title == "__xXNULLXx__" ? null :  req.params.title,
      desc: req.params.desc == "__xXNULLXx__" ? null : req.params.desc,
      likes: old_metadata.likes,
      comments: old_metadata.comments,
      views: old_metadata.views
    }
    console.log("begin update");
    await db.collection('fs.files').updateOne({ _id: new ObjectId(req.params._id) }, { 
        $set: { 
          'metadata': new_metadata 
        } 
    });
    console.log("done updating");
    res.end();
  });
  
  app.delete('/api/delete/:_id', async (req, res) => {
    console.log("=========================================ROUTE: /API/DELETE=============================================")
    console.log("DELETING FILE");
    await db.collection('fs.files').deleteOne({ _id: new ObjectId(req.params._id) });
    console.log("Deleted file!");
    res.end();
  });
  
  app.listen(8080, () => {
    console.log('Server listening on port 8080');
  }).timeout = 10000;
}