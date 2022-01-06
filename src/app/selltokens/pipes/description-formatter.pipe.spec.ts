import { DescriptionFormatterPipe } from './description-formatter.pipe';

describe('DescriptionFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new DescriptionFormatterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should replace /newLineSeparator/ with br tag', () => {
    const pipe = new DescriptionFormatterPipe();
    expect(pipe.transform('The sai impaziente puo necessario somigliava. La va diritto da profumi ma accosta. Foglie eri gomito gli ali finito sua. Salutando illusione consumato ti le esistenza. Ambe solo lui una caro. Piacerebbe chi puo sul commozione immutabile adorazione bruciavano uso sospettoso. Mani le ambo luce tebe io si vele. Anche buona linea chi ben oro cui fibra grido. /newLineSeparator//newLineSeparator/'))
      .toBe(`The sai impaziente puo necessario somigliava. La va diritto da profumi ma accosta. Foglie eri gomito gli ali finito sua. Salutando illusione consumato ti le esistenza. Ambe solo lui una caro. Piacerebbe chi puo sul commozione immutabile adorazione bruciavano uso sospettoso. Mani le ambo luce tebe io si vele. Anche buona linea chi ben oro cui fibra grido. <br /><br />`);
  });
});
