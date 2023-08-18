import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
  Put,
  Get,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Not, In } from 'typeorm';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async addArticle(@UploadedFile() file, @Body() body) {
    const article = JSON.parse(body.article);
    if (article.content.length > 15360) return { error: '文章长度超出' };
    const data = await this.articleService.getArticle({
      title: article.title,
    });
    if (data) return { error: '存在相同标题的文章' };
    article.createTime = new Date(article.createTime);
    article.modiTime = new Date(article.modiTime);
    return this.articleService.addArticle({
      filename: file.filename,
      ...article,
    });
  }

  @Delete('')
  async deleteArticle(@Body() { id }) {
    return await this.articleService.deleteArticle(id);
  }

  @Put('')
  @UseInterceptors(FileInterceptor('file'))
  async updateArticle(@UploadedFile() file, @Body() body) {
    const article = JSON.parse(body.article);
    if (article.content.length > 15360) return { error: '文章长度超出' };
    const id = article.id;
    const data = await this.articleService.getArticle({
      title: article.title,
      id: Not(id),
    });
    if (data) return { error: '存在相同标题的文章' };
    if (!id) return { error: '没有id' };
    article.createTime = new Date(article.createTime);
    article.modiTime = new Date(article.modiTime);
    this.articleService.updateArticle(id, {
      ...article,
      filename: file?.filename || null,
    });
    return await this.articleService.getArticle({ id });
  }

  @Get(':id')
  async getArticle(@Param() { id }, @Req() { _id }) {
    const res = await this.articleService.getArticle({ id });
    if (!res) return { error: '数据加载错误，可能是个无效的id' };
    if (!_id && !res.publicState) {
      return { error: '私有文章，无法查看' };
    }
    return res;
  }

  @Post('recommendList')
  async getArticleRecommendList(@Body() { recommendIdList, defaultData }) {
    if (!recommendIdList.length) {
      // 没有推荐列表，取默认用户的推荐列表
      const user = await this.userService.getUser({});
      recommendIdList = user?.recommendIdList;
    }
    let res = await this.articleService.getArticleList({
      id: In(recommendIdList || []),
    });
    if (res.length) {
      // 有推荐列表的数据
      res.forEach((item) => {
        item.sortValue = recommendIdList.indexOf(item.id);
      });
      res = res.sort((a, b) => a.sortValue - b.sortValue);
      return res;
    }
    if (!defaultData) return []; // false不给
    return this.articleService.searchArticleList({
      kw: '',
      order: 'DESC',
      skip: 0,
      take: 10,
    });
  }
  @Get('')
  async searchArticle(@Query() query) {
    const defaultQuery = { kw: '', order: 'DESC', skip: 0, take: 20 };
    const finalQuery = {
      ...defaultQuery,
      ...query,
    };
    const count = await this.articleService.searchArticleListCount(finalQuery);
    if (count === 0) return { count, articleList: [] };
    const articleList = await this.articleService.searchArticleList(finalQuery);
    return { count, articleList };
  }
}
