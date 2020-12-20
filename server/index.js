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
// feature 5 - get request to cart
app.get('/api/cart/', (req, res, next) => {
  const sql = `
  select "c"."cartItemId",
         "c"."price",
         "p"."productId",
         "p"."image",
         "p"."name",
         "p"."shortDescription"
    from "cartItems" as "c"
    join "products"  as "p" using ("productId")
   where "c"."cartId" = $1
  `;
  if (!req.session.cartId) return res.json([]);
  const value = [req.session.cartId];
  db.query(sql, value)
    .then(result => {
      const data = result.rows;
      res.status(200).json(data);
    })
    .catch(err => next(err));
});

app.post('/api/cart', (req, res, next) => {
  const { productId } = req.body;

  if (!Number(productId)) {
    return next(new ClientError(`${productId} is not a valid Product ID`, 400));
  }

  const sql = `
  select "price"
  from   "products"
  where  "productId" = $1
  `;

  db.query(sql, [productId])
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError('productId does not exist', 400);
      } else if (req.session.cartId) {
        return {
          price: result.rows[0].price,
          cartId: req.session.cartId
        };
      }
      const sql = `
        insert into "carts" ("cartId", "createdAt")
        values (default, default)
        returning "cartId"
      `;
      return db.query(sql).then(cartId => ({
        price: result.rows[0].price,
        cartId: cartId.rows[0].cartId
      }));
    })
    .then(cartItems => {
      req.session.cartId = cartItems.cartId;
      const price = cartItems.price;
      const sql = `
        insert into "cartItems" ("cartId", "productId", "price")
        values ($1, $2, $3)
        returning "cartItemId"
      `;

      return db
        .query(sql, [cartItems.cartId, productId, price])
        .then(cartItemId => cartItemId.rows[0]);
    })
    .then(cartItemId => {
      const sql = `
      select "c"."cartItemId",
        "c"."price",
        "p"."productId",
        "p"."image",
        "p"."name",
        "p"."shortDescription"
      from "cartItems" as "c"
      join "products" as "p" using ("productId")
      where "c"."cartItemId" = $1
      `;

      return db.query(sql, [cartItemId.cartItemId])
        .then(cartItems => {
          res.status(201).json(cartItems.rows);
        });
    })
    .catch(err => next(err));
});

app.post('/api/orders', (req, res, next) => {
  const { name, creditCard, shippingAddress } = req.body;
  const { cartId } = req.session;
  if (!cartId) {
    return res.status(400).json(({ error: 'cartId not found' }));
  }
  if (!name || !creditCard || !shippingAddress) {
    return res.status(400).json({ error: 'Please type in address, credit card, and shipping address in the proper fields' });
  }

  const inputOrder = `
    insert into "orders" ("cartId", "name", "creditCard", "shippingAddress")
    values ($1, $2, $3, $4)
    returning "orderId",
              "createdAt",
              "name",
              "creditCard",
              "shippingAddress"
    `;

  const values = [cartId, name, creditCard, shippingAddress];
  db.query(inputOrder, values)
    .then(data => {
      delete req.session.cartId;
      res.status(201).json(data.rows[0]);
    })
    .catch(err => next(err));
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
