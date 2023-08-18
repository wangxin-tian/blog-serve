import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  addUser({ username, password }) {
    const data = new User();
    data.username = username;
    data.password = password;
    data.recommendIdList = [];
    return this.user.save(data);
  }

  updateUserRecommendList(recommendIdList: string[], id) {
    return this.user.update(id, { recommendIdList });
  }

  getUser(where) {
    return this.user.findOne({ where });
  }
}
