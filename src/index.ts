import dotenv from 'dotenv';
import express from 'express';
import metaOauthRoutes from './routes/callback/callback.route';
import channelsRoutes from './routes/channels/channels.route';
import webhooksRoutes from './routes/webhook/webhook.route';
import { bootstrap } from './utils/bootstrap';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
bootstrap()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });
app.use(express.json());

app.use(metaOauthRoutes);
app.use(channelsRoutes);
app.use(webhooksRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
