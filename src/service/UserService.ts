import { getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { TeamDTO } from '../dto/TeamDTO';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { UserGetResponse as GetResponse } from '../dto/response/user/UserGetResponse';
import { UserDTO } from '../dto/UserDTO';
import { UserRepository } from '../repository/UserRepository';

class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getManager().getCustomRepository(UserRepository);
    }

    async getAll(): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async get(id: number): Promise<GetResponse> {
        let user;

        try {
            user = await this.userRepository.createQueryBuilder('user')
                .innerJoinAndSelect('user.stocks', 'userStocks')
                .leftJoinAndSelect('user.userBalance', 'balance')
                .where('user.id = :id', { id })
                .getOneOrFail();
        } catch (error) {
            return new GetResponse(
                `Error occured finding User [${id}]`,
                null,
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            );
        }

        if (user === undefined) {
            return new GetResponse(
                `Couldn\'t find User [${id}]`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        return new GetResponse(
            `Found User ${user.username} ${id}`,
            user,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async getByUsername(username: string): Promise<GetResponse> {
        let user;

        try {
            user = await this.userRepository.getOneByUsername(username);
        } catch (error) {
            return new GetResponse(
                `Error occured finding User [${username}]`,
                null,
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            );
        }

        if (user === undefined) {
            return new GetResponse(
                `Couldn\'t find User [${username}]`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        return new GetResponse(
            `Found User ${user.username} [${user.id}]`,
            user,
            HttpCodes.HTTP_STATUS_OK,
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
