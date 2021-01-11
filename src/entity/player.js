import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Player {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('varchar')
	firstName = '';

	@Column('varchar')
	lastName = '';

	getId() {
		return id;
	}

	getFullName() {
		return `${firstName} ${lastName}`;
	}
}
