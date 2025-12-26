import express from 'express';
import { AppContext } from './config/app-context';
const app = express();
app.use(express.json())




const authController = AppContext.getAuthControllerInstance()


app.post('/oauth/login',(req,res)=> {
    authController.signIn(req,res);
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('*     *')
    console.log(' *   * ')
    console.log('  * *  ')
    console.log('   *   ')
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});