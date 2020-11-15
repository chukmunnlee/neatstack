import { Kcard, Kboard, Priority } from 'common/models'
import {Length, Min, IsOptional, Max, ValidateNested} from 'class-validator'
import { plainToClass, classToPlain } from 'class-transformer'

export class KboardImpl implements Kboard {
	@Length(8, 8)
	boardId: string = '########';

	@Min(0)
	createdOn: number = 0;

	@Min(0) @IsOptional()
	updatedOn?: number;

	@Length(1, 64)
	title: string;

	@Length(3, 15)
	createdBy: string;

	@IsOptional()
	comments: string;

	@ValidateNested()
	private _cards: KcardImpl[] = [];

	get cards(): Kcard[] {
		return this._cards.map(c => classToPlain(c) as Kcard)
	}
	set cards(kc: Kcard[]) {
		this._cards = kc.map(c => plainToClass(KcardImpl, c))
	}
}

export class KcardImpl implements Kcard {
	@Length(1, 64)
	description: string;

	@Min(Priority.Low) @Max(Priority.High)
	priority: Priority;
}

