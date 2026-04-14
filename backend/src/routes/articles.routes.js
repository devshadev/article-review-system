const express = require("express");
const mongoose = require("mongoose");
const { Article } = require("../models/Article");
const { Review } = require("../models/Review");
const memoryArticles = [];

const domainFromUrl = (value) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

function mapArticleWithStats(article, statsById) {
  const stat = statsById.get(String(article._id));
  return {
    id: String(article._id),
    title: article.title,
    description: article.description ?? null,
    url: article.url,
    image: article.image ?? null,
    source: article.source ?? null,
    createdAt: article.createdAt,
    reviewCount: stat?.reviewCount ?? 0,
    averageRating: stat?.averageRating ?? null,
  };
}

async function buildStatsByArticleId(articleIds) {
  if (articleIds.length === 0) {
    return new Map();
  }

  const aggregates = await Review.aggregate([
    {
      $match: {
        articleId: { $in: articleIds },
      },
    },
    {
      $project: {
        articleId: 1,
        score: {
          $divide: [{ $add: ["$clarity", "$depth", "$usefulness", "$credibility"] }, 4],
        },
      },
    },
    {
      $group: {
        _id: "$articleId",
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$score" },
      },
    },
  ]);

  const statsMap = new Map();
  for (const item of aggregates) {
    statsMap.set(String(item._id), {
      reviewCount: item.reviewCount,
      averageRating: Number(item.averageRating.toFixed(2)),
    });
  }
  return statsMap;
}

function articlesRouter(authMiddleware, options = {}) {
  const router = express.Router();
  const protect = authMiddleware ?? ((_req, _res, next) => next());
  const isDbReady = options.isDbReady ?? (() => true);

  router.get("/", async (_req, res, next) => {
    try {
      if (!isDbReady()) {
        return res.json(memoryArticles);
      }

      const articles = await Article.find().sort({ createdAt: -1 });
      const statsById = await buildStatsByArticleId(articles.map((article) => article._id));
      res.json(articles.map((article) => mapArticleWithStats(article, statsById)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      if (!isDbReady()) {
        const article = memoryArticles.find((item) => item.id === req.params.id);
        if (!article) {
          return res.status(404).json({ error: "article not found" });
        }
        return res.json(article);
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "invalid article id" });
      }

      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "article not found" });
      }

      const statsById = await buildStatsByArticleId([article._id]);
      return res.json(mapArticleWithStats(article, statsById));
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const { url, title, description, image } = req.body;
      if (!url) {
        return res.status(400).json({ error: "url is required" });
      }

      const normalizedUrl = String(url).trim();
      const articleTitle = String(title ?? "").trim() || "Untitled article";
      const source = domainFromUrl(normalizedUrl);

      if (!isDbReady()) {
        if (memoryArticles.some((article) => article.url === normalizedUrl)) {
          return res.status(409).json({ error: "article already exists for this URL" });
        }

        const article = {
          id: `${Date.now()}`,
          url: normalizedUrl,
          title: articleTitle,
          description: description?.trim() ?? null,
          image: image?.trim() ?? null,
          source: source ?? null,
          createdAt: new Date().toISOString(),
          reviewCount: 0,
          averageRating: null,
        };
        memoryArticles.unshift(article);
        return res.status(201).json(article);
      }

      const existing = await Article.findOne({ url: normalizedUrl }).lean();
      if (existing) {
        return res.status(409).json({ error: "article already exists for this URL" });
      }

      const article = await Article.create({
        url: normalizedUrl,
        title: articleTitle,
        description: description?.trim(),
        image: image?.trim(),
        source,
      });

      return res.status(201).json({
        id: String(article._id),
        title: article.title,
        description: article.description ?? null,
        url: article.url,
        image: article.image ?? null,
        source: article.source ?? null,
        createdAt: article.createdAt,
        reviewCount: 0,
        averageRating: null,
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ error: "article already exists for this URL" });
      }
      return next(error);
    }
  });

  router.put("/:id", protect, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "invalid article id" });
      }

      const { title, description, image } = req.body;
      const updated = await Article.findByIdAndUpdate(
        req.params.id,
        {
          ...(title ? { title: String(title).trim() } : {}),
          ...(description !== undefined ? { description: String(description).trim() } : {}),
          ...(image !== undefined ? { image: String(image).trim() } : {}),
        },
        { new: true },
      );

      if (!updated) {
        return res.status(404).json({ error: "article not found" });
      }

      const statsById = await buildStatsByArticleId([updated._id]);
      return res.json(mapArticleWithStats(updated, statsById));
    } catch (error) {
      return next(error);
    }
  });

  router.delete("/:id", protect, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "invalid article id" });
      }

      const deleted = await Article.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "article not found" });
      }

      await Review.deleteMany({ articleId: req.params.id });
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = { articlesRouter };
