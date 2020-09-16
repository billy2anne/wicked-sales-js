require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const products = `
  select "productId",
         "name",
         "price",
         "image",
         "shortDescription"
  from "products"
`;
  db.query(products)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/products/:id', (req, res, next) => {
  //  if id requested is less than 0, return a status of an invalid id
  if (req.params.id <= 0) {
    return res.status(400).json({
      error: 'ProductId entered is invalid.'
    });

  } else {
    // if not invalid, then get all data for product at product id
    db.query(`
      select *
      from   "products"
      where  "productId" = $1;
    `, [req.params.id])
      .then(result => {
        if (!result.rows[0]) {
          return res.status(404).json({
            error: `ProductId: ${req.params.id} is not found.`
          });
        } else {
          res.json(result.rows[0]);
        }
      }).catch(err => {
        console.error(err);
        next(new ClientError('unexpected error', 500));
      });
  }
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
