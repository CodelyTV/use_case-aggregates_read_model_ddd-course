export type ProductTopReviewPrimitives = {
	userName: string;
	userProfilePictureUrl: string;
	reviewRating: number;
	reviewComment: string;
};

export class ProductTopReview {
	constructor(
		public readonly userName: string,
		public readonly userProfilePictureUrl: string,
		public readonly reviewRating: number,
		public readonly reviewComment: string,
	) {}

	static fromPrimitives(primitives: ProductTopReviewPrimitives): ProductTopReview {
		return new ProductTopReview(
			primitives.userName,
			primitives.userProfilePictureUrl,
			primitives.reviewRating,
			primitives.reviewComment,
		);
	}

	toPrimitives(): ProductTopReviewPrimitives {
		return {
			userName: this.userName,
			userProfilePictureUrl: this.userProfilePictureUrl,
			reviewComment: this.reviewComment,
			reviewRating: this.reviewRating,
		};
	}
}
