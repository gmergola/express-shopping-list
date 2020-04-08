const express = require("express");
const app = express();
const database = require('./fakeDb');
const ExpressError = require('./expressError')

app.use(express.json());

app.get('/items', function(req, res){
  return res.json(database);
})

app.post('/items', function(req, res, next){
  try{
    database.push(req.body);

    return res.json({ added: req.body});
  }catch (err){
    return next(err);
  }
})

app.get('/items/:name', function(req, res, next){
  try{
    for(let item of database){
      if(req.params.name === item.name){
        return res.json(item);
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  }catch (err){
    return next(err);
  }
})

app.patch('/items/:name', function(req, res, next){
  try{
    for(let item of database){
      if(req.params.name === item.name){
        if(req.body.name !== item.name){
          item.name = req.body.name;
        }
        if(req.body.price !== item.price){
          item.price = req.body.price;
        }
        return res.json({"updated": req.body});
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  }catch (err){
    return next(err);
  }
})

app.delete('/items/:name', function(req, res, next){
  try{
    for(let i = 0; i < database.length; i++){
      if(req.params.name === database[i].name){
        database.splice(i, 1);
        return res.json({message: "Deleted"})
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  }catch (err){
    return next(err);
  }
})



// 404 handler
app.use(function(req, res) {
  return new ExpressError("Not Found", 404);
});


// generic error handler
app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});


// end generic handler
app.listen(3000, function() {
  console.log("Server is listening on port 3000");
});
// end app.listen