import { DomainEvent, DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

export class ProductReviewCreatedDomainEvent extends DomainEvent {
	static eventName = "codely.shop.product_review.created";

	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly productId: string,
		public readonly rating: number,
		public readonly comment: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(ProductReviewCreatedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): ProductReviewCreatedDomainEvent {
		return new ProductReviewCreatedDomainEvent(
			aggregateId,
			attributes.userId as string,
			attributes.productId as string,
			attributes.rating as number,
			attributes.comment as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): DomainEventAttributes {
		return {
			id: this.id,
			userId: this.userId,
			productId: this.productId,
			rating: this.rating,
			comment: this.comment,
		};
	}
}
