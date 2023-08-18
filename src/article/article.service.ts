import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly article: Repository<Article>,
  ) {}

  addArticle(article) {
    const data = createArticle(article);
    return this.article.save(data);
  }

  deleteArticle(id: string) {
    return this.article.delete(id);
  }

  updateArticle(id, article) {
    const data = createArticle(article);
    return this.article.update(id, data);
  }

  getArticle(where: FindOptionsWhere<Article> | FindOptionsWhere<Article>[]) {
    return this.article.findOne({
      where,
      relations: ['tag'],
    });
  }

  getArticleList(
    where: FindOptionsWhere<Article> | FindOptionsWhere<Article>[],
  ) {
    return this.article.find({
      select: [
        'createTime',
        'id',
        'imageSrc',
        'introduction',
        'modiTime',
        'tag',
        'tagId',
        'title',
        'publicState',
      ],
      where,
      relations: ['tag'],
    });
  }

  searchArticleList({ skip, take, kw, order }) {
    return this.article
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tag', 'tag')
      .select([
        'article.createTime',
        'article.id',
        'article.imageSrc',
        'article.introduction',
        'article.modiTime',
        'article.tagId',
        'article.title',
        'article.publicState',
        'tag',
      ])
      .where('article.title like :kw', { kw: `%${kw}%` })
      .orWhere('article.introduction like :kw', { kw: `%${kw}%` })
      .orWhere('article.content like :kw', { kw: `%${kw}%` })
      .orWhere('tag.name like :kw', { kw: `%${kw}%` })
      .orderBy('article.createTime', order)
      .skip(skip)
      .take(take)
      .getMany();
  }

  searchArticleListCount({ kw }) {
    return this.article
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tag', 'tag')
      .where('article.title like :kw', { kw: `%${kw}%` })
      .orWhere('article.introduction like :kw', { kw: `%${kw}%` })
      .orWhere('article.content like :kw', { kw: `%${kw}%` })
      .orWhere('tag.name like :kw', { kw: `%${kw}%` })
      .getCount();
  }
}

const createArticle = ({
  title,
  tagId,
  introduction,
  content,
  createTime,
  modiTime,
  publicState,
  filename,
}) => {
  const data = new Article();
  data.title = title;
  data.tagId = tagId;
  data.introduction = introduction;
  data.content = content;
  data.createTime = createTime;
  data.modiTime = modiTime;
  data.publicState = publicState;
  if (filename) {
    data.imageSrc = filename;
  }
  return data;
};
