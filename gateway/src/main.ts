import express from 'express';
import { AppContext } from './shared/infrastructure/app-context';
import path from 'path';
const app = express();
app.use(express.json())


app.use('/public', express.static(path.join(__dirname, '../public')))



const authController = AppContext.getAuthControllerInstance()
const userController = AppContext.getUserControllerInstance();

app.get('/',(req,res) => {
    return res.send('Hello World :=)');
})

app.post('/oauth/login',(req,res)=> {
    authController.signIn(req,res);
})

app.get('/oauth/google', (req,res) => {
    authController.signIn(req,res);
})

app.get('/auth/google/callback', (req,res) => {
    authController.oauthCallback(req,res)
})

app.get('/user/info',(req,res)=> {
    userController.getUserInfo(req,res);
})

app.post('/user/create',(req,res)=> {
    userController.createUser(req,res);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('*     *')
    console.log(' *   * ')
    console.log('  * *  ')
    console.log('   *   ')
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});