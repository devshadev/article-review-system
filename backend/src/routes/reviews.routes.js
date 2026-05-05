const express = require("express");
const mongoose = require("mongoose");
const { Review } = require("../models/Review");
const { Article } = require("../models/Article");

function mapReview(review) {
  return {
    id: String(review._id),
    userId: String(review.userId),
    articleId: String(review.articleId),
    clarity: review.clarity,
    depth: review.depth,
    usefulness: review.usefulness,
    credibility: review.credibility,
    comment: review.comment ?? null,
    createdAt: review.createdAt,
  };
}

function reviewsRouter() {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const { articleId, clarity, depth, usefulness, credibility, comment } = req.body;

      if (!articleId || !mongoose.isValidObjectId(articleId)) {
        return res.status(400).json({ error: "valid articleId is required" });
      }

      const article = await Article.findById(articleId).lean();
      if (!article) {
        return res.status(404).json({ error: "article not found" });
      }

      const review = await Review.create({
        userId: req.auth.userId,
        articleId,
        clarity,
        depth,
        usefulness,
        credibility,
        comment: comment?.trim(),
      });

      return res.status(201).json(mapReview(review));
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ error: "you already reviewed this article" });
      }
      if (error?.name === "ValidationError") {
        return res.status(400).json({ error: "review fields must be integers from 1 to 5" });
      }
      return next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "invalid review id" });
      }

      const { clarity, depth, usefulness, credibility, comment } = req.body;
      const review = await Review.findOne({
        _id: req.params.id,
        userId: req.auth.userId,
      });

      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }

      if (clarity !== undefined) review.clarity = clarity;
      if (depth !== undefined) review.depth = depth;
      if (usefulness !== undefined) review.usefulness = usefulness;
      if (credibility !== undefined) review.credibility = credibility;
      if (comment !== undefined) review.comment = String(comment).trim();

      await review.save();
      return res.json(mapReview(review));
    } catch (error) {
      if (error?.name === "ValidationError") {
        return res.status(400).json({ error: "review fields must be integers from 1 to 5" });
      }
      return next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "invalid review id" });
      }

      const deleted = await Review.findOneAndDelete({
        _id: req.params.id,
        userId: req.auth.userId,
      });

      if (!deleted) {
        return res.status(404).json({ error: "review not found" });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

function articleReviewsRouter() {
  const router = express.Router({ mergeParams: true });

  router.get("/", async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "invalid article id" });
      }

      const reviews = await Review.find({ articleId: id }).sort({ createdAt: -1 });
      return res.json(reviews.map(mapReview));
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = { reviewsRouter, articleReviewsRouter };
