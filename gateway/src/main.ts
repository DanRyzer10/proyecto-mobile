import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import apiRouter from '@/shared/infrastructure/routes';
import moodleProxyRouter from '@/shared/infrastructure/routes/moodle-proxy.routes';
import { AppContext } from './shared/infrastructure/app-context';

const app = express();
app.use(express.json())
AppContext.connectToCosmos();

app.use('/public', express.static(path.join(__dirname, '../public')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
    res.send('OK');
})


app.use('/api/v1', apiRouter);



app.use(moodleProxyRouter);

const PORT = process.env.PORT || 8080;

const banner = `
====================================
||        Moodle Gateway          ||
====================================
`;
app.listen(PORT, () => {
    console.log(banner);
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
