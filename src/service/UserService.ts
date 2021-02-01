import { getManager, Repository } from 'typeorm';
import { TeamDTO } from '../dto/TeamDTO';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { User } from '../entity/User';

class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getManager().getRepository(User);
    }

    async getAll(): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async get(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async create(teamDTO: TeamDTO): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async update(id: number, teamDTO: TeamDTO, options?: object): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}

export default UserService;