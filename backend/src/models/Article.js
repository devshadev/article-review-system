const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    url: { type: String, required: true, unique: true, trim: true },
    image: { type: String, trim: true },
    source: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

articleSchema.index({ createdAt: -1 });

const Article = mongoose.model("Article", articleSchema);

module.exports = { Article };
