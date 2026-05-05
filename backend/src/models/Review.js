const mongoose = require("mongoose");

const ratingField = { type: Number, required: true, min: 1, max: 5 };

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    clarity: ratingField,
    depth: ratingField,
    usefulness: ratingField,
    credibility: ratingField,
    comment: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

reviewSchema.index({ userId: 1, articleId: 1 }, { unique: true });
reviewSchema.index({ articleId: 1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
