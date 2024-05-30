import { ProductReviewRatingInvalidError } from "./ProductReviewRatingInvalidError";

export class ProductReviewRating {
	constructor(public readonly value: number) {
		if (value < 0 || value > 5) {
			throw new ProductReviewRatingInvalidError(value);
		}
	}
}
