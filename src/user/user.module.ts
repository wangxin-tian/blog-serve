import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // forFeature定义在当前作用域内注册了哪些存储库
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
