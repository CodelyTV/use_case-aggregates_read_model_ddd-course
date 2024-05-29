import { DomainError } from "../../../shared/domain/DomainError";

export class ProductDoesNotExistError extends DomainError {
	readonly type = "ProductDoesNotExistError";
	readonly message = `The product ${this.id} does not exist`;

	constructor(public readonly id: string) {
		super();
	}
}
