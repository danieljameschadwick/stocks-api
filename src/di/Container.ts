import { Container } from 'inversify';
import { PlayerService } from '../service/PlayerService';
import { StockService } from '../service/StockService';
import { TeamService } from '../service/TeamService';
import { UserService } from '../service/UserService';
import UserStockService from '../service/UserStockService';
import { TYPES } from './Types';

const container = new Container();
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerService);
container.bind<StockService>(TYPES.StockService).to(StockService);
container.bind<TeamService>(TYPES.TeamService).to(TeamService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserStockService>(TYPES.UserStockService).to(UserStockService);

export { container };
