import { DomainError } from "../../../shared/domain/DomainError";

export class ProductReviewRatingInvalidError extends DomainError {
	readonly type = "ProductReviewRatingInvalidError";
	readonly message = `The value ${this.value} is not a valid rating. It must be between 0 and 5`;

	constructor(public readonly value: number) {
		super();
	}
}
