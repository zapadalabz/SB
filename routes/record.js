const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("BH");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("records")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();  
  let myquery = { _id: ObjectId( req.params.id )};  
  let newvalues = {    
    $set: {      
      name: req.body.name,     
      position: req.body.position,      
      level: req.body.level,    
  },  
};
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

// Adds/Updates user of OrgUnit by email
recordRoutes.route("/api/update").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { email: req.body.email};
  let myobj = {
    $set:{
          Skills: req.body.skills
      }
  };
  db_connect.collection(req.body.OrgUnitId).updateOne(myquery, myobj, { upsert: true },function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// Adds/Updates user of OrgUnit by email
recordRoutes.route("/api/updateSkillsTemplate").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { template: "skills"};
  let myobj = {
    $set:{
          Skills: req.body.skills
      }
  };
  db_connect.collection(req.body.OrgUnitId).updateOne(myquery, myobj, { upsert: true },function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

recordRoutes.route("/api/skillsTemplate/:OrgUnitId").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { template: "skills"};
  db_connect
      .collection(req.params.OrgUnitId)
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

recordRoutes.route("/api/skills/:OrgUnitId/:email").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {email: req.params.email};
  db_connect
      .collection(req.params.OrgUnitId)
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you get a list of all the records.
recordRoutes.route("/api/:OrgUnitId").get(function (req, res) {
  let db_connect = dbo.getDb("BH");
  db_connect
    .collection(req.params.OrgUnitId)
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


module.exports = recordRoutes;