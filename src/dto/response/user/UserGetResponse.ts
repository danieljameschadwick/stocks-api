import { AbstractResponse } from '../abstract/AbstractResponse';
import { User } from '../../../entity/User';

export class UserGetResponse extends AbstractResponse {
    data: User;
}