import express, { Request, Response } from 'express';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import router from './routes';
import logger from 'morgan';
import { AppDataSource } from './config/ormconfig';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';
import { engine } from 'express-handlebars';
import hbs from 'hbs';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {
  UpdateStatusInvoice,
  ininitScheduledJobs,
} from './controller/admin/schedule.revenue';

interface HandlebarsHelperThis {
  switch_value: any;
}

initializeTransactionalContext();
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//i18next
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'vi',
    preload: ['vi', 'en'],
    supportedLngs: ['vi', 'en'],
    saveMissing: true,
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'locale',
      lookupCookie: 'locale',
      ignoreCase: true,
      cookieSecure: false,
    },
  });
app.use(i18nextMiddleware.handle(i18next));

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser('secretString'));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'morricoffee',
    cookie: { maxAge: 720000 },
  }),
);
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
// Template engine
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      switch: function (this: HandlebarsHelperThis, value: any, options: any) {
        this.switch_value = value;
        return options.fn(this);
      },
      case: function (this: HandlebarsHelperThis, value: any, options: any) {
        if (value == this.switch_value) {
          return options.fn(this);
        }
      },
      // eq is helper to compare 2 values
      eq: function (str1: string, str2: string) {
        if (str1 == str2) {
          return true;
        } else {
          return false;
        }
      },
      lte: function (num1: number, num2: number) {
        if (num1 <= num2) {
          return true;
        } else {
          return false;
        }
      },
      times: function (n: number, block: any) {
        let accum = '';
        for (let i = 1; i <= n; ++i) {
          block.data.index = i;
          block.data.first = i === 0;
          block.data.last = i === n - 1;
          accum += block.fn(this);
        }
        return accum;
      },
      json: function (context: any) {
        return JSON.stringify(context);
      },
    },
  }),
);
app.set('view engine', '.hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'), () => {});
app.use(logger('dev'));

app.use(router);

app.use((err: Error, req: Request, res: Response) => {
  if (err) {
    console.error(err.message);
  } else {
    res.status(500).send('Something went wrong!');
  }
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database initialized');
  })
  .catch((error: Error) => console.log('Database connect failed: ', error));
// Start server

ininitScheduledJobs();
UpdateStatusInvoice();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
