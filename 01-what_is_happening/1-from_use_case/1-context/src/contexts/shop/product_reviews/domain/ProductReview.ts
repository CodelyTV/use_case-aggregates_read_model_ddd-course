import { Primitives } from "@codelytv/primitives-type";

import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { UserName } from "../../users/domain/UserName";
import { UserProfilePicture } from "../../users/domain/UserProfilePicture";
import { ProductReviewComment } from "./ProductReviewComment";
import { ProductReviewId } from "./ProductReviewId";
import { ProductReviewRating } from "./ProductReviewRating";

export class ProductReview {
	public readonly id: ProductReviewId;
	public readonly userId: UserId;
	public readonly productId: ProductId;
	public readonly rating: ProductReviewRating;
	public readonly comment: ProductReviewComment;
	public readonly userName: UserName;
	public readonly userProfilePicture: UserProfilePicture;

	constructor(
		id: string,
		userId: string,
		productId: string,
		rating: number,
		comment: string,
		userName: string,
		userProfilePicture: string,
	) {
		this.id = new ProductReviewId(id);
		this.userId = new UserId(userId);
		this.productId = new ProductId(productId);
		this.rating = new ProductReviewRating(rating);
		this.comment = new ProductReviewComment(comment);
		this.userName = new UserName(userName);
		this.userProfilePicture = new UserProfilePicture(userProfilePicture);
	}

	static create(
		id: string,
		userId: string,
		productId: string,
		rating: number,
		comment: string,
		userName: string,
		userProfilePicture: string,
	): ProductReview {
		return new ProductReview(id, userId, productId, rating, comment, userName, userProfilePicture);
	}

	static fromPrimitives(primitives: Primitives<ProductReview>): ProductReview {
		return new ProductReview(
			primitives.id,
			primitives.userId,
			primitives.productId,
			primitives.rating,
			primitives.comment,
			primitives.userName,
			primitives.userProfilePicture,
		);
	}

	toPrimitives(): Primitives<ProductReview> {
		return {
			id: this.id.value,
			userId: this.userId.value,
			productId: this.productId.value,
			rating: this.rating.value,
			comment: this.comment.value,
			userName: this.userName.value,
			userProfilePicture: this.userProfilePicture.value,
		};
	}
}
