import { getManager, Repository } from 'typeorm';
import { TeamDTO } from '../dto/TeamDTO';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { UserGetResponse as GetResponse } from '../dto/response/user/UserGetResponse';
import { User } from '../entity/User';
import { UserDTO } from '../dto/UserDTO';
import { constants as HttpCodes } from 'http2';

class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getManager().getRepository(User);
    }

    async getAll(): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async get(id: number): Promise<GetResponse> {
        let user = undefined;

        try {
            user = await this.userRepository.createQueryBuilder('user')
                .innerJoinAndSelect('user.stocks', 'userStocks')
                .leftJoinAndSelect('user.balance', 'balance')
                .where('user.id = :id', { id })
                .getOneOrFail();
        } catch (error) {
            console.log(error);

            return new GetResponse(
                `Error occured finding User [${id}]`,
                null,
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
            );
        }

        if (user === undefined) {
            return new GetResponse(
                `Couldn\'t find User [${id}]`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND
            );
        }

        return new GetResponse(
            `Found User ${user.username} ${id}`,
            user,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async create(teamDTO: TeamDTO): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async update(id: number, userDTO: UserDTO, options?: object): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}

export default UserService;