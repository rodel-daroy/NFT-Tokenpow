import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta) { }

  generateTags(configs): void {
    const config = {
      title: configs.title,
      description: configs.description,
      image: configs.image,
      slug: '',
    };

    //console.log('CONFIG JE: ', config);

    this.meta.updateTag({name: 'twitter:card', content: 'summary'});
    this.meta.updateTag({name: 'twitter:site', content: 'TokenPow'});
    this.meta.updateTag({name: 'twitter:title', content: config.title});
    this.meta.updateTag({name: 'twitter:description', content: config.description});
    this.meta.updateTag({name: 'twitter:image', content: config.image});

    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:site_name', content: 'TokenPow'});
    this.meta.updateTag({property: 'og:title', content: config.title});
    this.meta.updateTag({property: 'og:description', content: config.description});
    this.meta.updateTag({property: 'og:image', content: config.image});
    this.meta.updateTag({property: 'og:url', content: `https://token-pow.web.app/${config.slug}`});
  }
}
