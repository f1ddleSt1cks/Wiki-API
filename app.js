
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
        title: req.params.articleTitle
      },
      function(err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle)
        } else {
          res.send("No articles matching title were found")
        }
      });
  })

  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          console.log(err);
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Successfully deleted article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function(req, res) {
  console.log("Server started on port 3000");
});
