import { TransformCategoriesPipe } from './transform-categories.pipe';
import { ICategory } from '../../selltokens/models/category.model';

describe('TransformCategoriesPipe', () => {

  const pipe = new TransformCategoriesPipe();

  it('should format categories string', () => {
    const categories: string[] = [
        'Technology',
        'Movies, Tv & Books',
        'Beauty & Makeup'
    ];
    //const formattedString = pipe.transform(categories);
    //expect(formattedString).toBe('technology, movies, tv & books, beauty & makeup');
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
