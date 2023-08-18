import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { encryption, verification } from 'src/tools/bcrypt';
import { generateToken } from 'src/tools/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async addUser(@Body() body) {
    const { username } = body;
    let { password } = body;
    password = encryption(password);
    const data = await this.userService.getUser({ username });
    if (data) return { error: '用户名已存在' };
    return await this.userService.addUser({ username, password });
  }

  @Put('recommendList')
  async updateUserRecommendList(@Body() body) {
    const { id, recommendIdList } = body;
    if (!id) return { error: 'id错误' };
    await this.userService.updateUserRecommendList(recommendIdList || [], id);
    const user = await this.userService.getUser({ id });
    return { ...user, token: generateToken(user.id) };
  }

  @Post('login')
  async login(@Body() body, @Req() { _id }) {
    if (_id) {
      const data = await this.userService.getUser({ id: _id });
      if (!data.id) return { error: 'token错误' };
      return { ...data, token: generateToken(data.id) };
    }
    const data = await this.userService.getUser({ username: body.username });
    if (!data) return { error: '用户名错误' };
    if (verification(body.password, data.password)) {
      return { ...data, token: generateToken(data.id) };
    }
    return { error: '密码错误' };
  }
}
