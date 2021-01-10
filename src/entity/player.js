import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Player {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('varchar')
	firstName = '';

	@Column('varchar')
	lastName = '';

	getId() {
		return 1;
	}

	getFullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}
