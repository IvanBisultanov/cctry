import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import cors from 'cors';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(cors());

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/api/conversion-rates', async (req, res) => {
    // todo LATER* re do with https://freecurrencyapi.com/docs/latest#request-parameters
    const base: string | undefined = req.query['base'] as string | undefined;

    if (!base) {
      return res.status(400).json({ error: 'Base currency is required' });
    }

    try {
      let conversionRates: { data: Record<string, number> } = {
        data: {
          AUD: 1.5469001904,
          BGN: 1.8442102413,
          BRL: 5.7963106949,
          CAD: 1.4085302488,
          CHF: 0.8886501032,
          CNY: 7.2328409513,
          CZK: 23.9349041408,
          DKK: 7.0797412792,
          EUR: 0.9493001707,
          GBP: 0.792610131,
          HKD: 7.784581143,
          HRK: 6.7098009668,
          HUF: 387.5688277208,
          IDR: 15836.281818084,
          ILS: 3.7293006762,
          INR: 84.4086500446,
          ISK: 137.5529285301,
          JPY: 154.6510387625,
          KRW: 1392.4672784139,
          MXN: 20.3464535656,
          MYR: 4.4711905469,
          NOK: 11.0950716585,
          NZD: 1.7056702777,
          PHP: 58.744439469,
          PLN: 4.0994807841,
          RON: 4.7223804931,
          RUB: 100.0206234322,
          SEK: 10.9804513377,
          SGD: 1.342350234,
          THB: 34.7711739346,
          TRY: 34.4507246261,
          USD: 1,
          ZAR: 18.1777228204,
        },
      };

      if (base === 'EUR') {
        conversionRates = {
          data: {
            AUD: 1.6286827644,
            BGN: 1.9529652657,
            BRL: 6.0904020805,
            CAD: 1.4854168745,
            CHF: 0.9358811404,
            CNY: 7.6669630559,
            CZK: 25.2618165483,
            DKK: 7.4591435979,
            EUR: 1,
            GBP: 0.8358132683,
            HKD: 8.2457607174,
            HRK: 7.0755964193,
            HUF: 405.5041588054,
            IDR: 16771.2534395657,
            ILS: 3.9564839072,
            INR: 89.3948088181,
            ISK: 144.3606391001,
            JPY: 163.8268294465,
            KRW: 1472.2081493299,
            MXN: 21.4126277309,
            MYR: 4.7403025553,
            NOK: 11.652623594,
            NZD: 1.7987514396,
            PHP: 62.1720841298,
            PLN: 4.3136311024,
            RON: 4.9744690104,
            RUB: 105.8194432758,
            SEK: 11.5552582491,
            SGD: 1.4178748473,
            THB: 36.6026011361,
            TRY: 36.6732280926,
            USD: 1.0598158381,
            ZAR: 19.0186845387,
          },
        };
      } else if (base === 'RUB') {
        conversionRates = {
          data: {
            AUD: 0.0152169912,
            BGN: 0.0183096992,
            BRL: 0.0574259335,
            CAD: 0.01388505,
            CHF: 0.008776967,
            CNY: 0.0718485522,
            CZK: 0.2369867606,
            DKK: 0.0699683938,
            EUR: 0.0093798083,
            GBP: 0.0078388274,
            HKD: 0.0774257544,
            HRK: 0.0663596052,
            HUF: 3.8245747552,
            IDR: 157.1356949273,
            ILS: 0.0372534838,
            INR: 0.8383789407,
            ISK: 1.3640589661,
            JPY: 1.539476426,
            KRW: 13.8229213059,
            MXN: 0.1999875044,
            MYR: 0.0444544458,
            NOK: 0.1089910942,
            NZD: 0.0168128946,
            PHP: 0.5851689802,
            PLN: 0.0406184073,
            RON: 0.0466683117,
            RUB: 1,
            SEK: 0.1085325237,
            SGD: 0.0132997192,
            THB: 0.343402044,
            TRY: 0.3433205661,
            USD: 0.0099495164,
            ZAR: 0.1796072993,
          },
        };
      } else if (base === 'GBP') {
        conversionRates = {
          data: {
            AUD: 1.9412330855,
            BGN: 2.3357701573,
            BRL: 7.3258320723,
            CAD: 1.771317209,
            CHF: 1.1196785554,
            CNY: 9.1657269789,
            CZK: 30.2324246976,
            DKK: 8.9258749806,
            EUR: 1.1965830856,
            GBP: 1,
            HKD: 9.8772112208,
            HRK: 8.4655014596,
            HUF: 487.9013831963,
            IDR: 20045.8162832222,
            ILS: 4.7524306463,
            INR: 106.952085125,
            ISK: 174.0131384287,
            JPY: 196.3911612932,
            KRW: 1763.3914504556,
            MXN: 25.5124258964,
            MYR: 5.6710580883,
            NOK: 13.9040047695,
            NZD: 2.1448226466,
            PHP: 74.6500651957,
            PLN: 5.181694268,
            RON: 5.9534811838,
            RUB: 127.570099795,
            SEK: 13.8455048801,
            SGD: 1.6966465062,
            THB: 43.8078330241,
            TRY: 43.797438884,
            USD: 1.2692607973,
            ZAR: 22.9125210955,
          },
        };
      } else if (base !== 'USD') {
        conversionRates = {
          data: Object.keys(conversionRates.data).reduce(
            (acc: Record<string, number>, key: string) => {
              acc[key] = Math.random() / 10;
              return acc;
            },
            {} as Record<string, number>,
          ),
        };
      }

      return res.json({ base: base.toUpperCase(), rates: conversionRates });
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
      return res
        .status(500)
        .json({ error: 'Failed to fetch conversion rates' });
    }
  });

  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4210;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
