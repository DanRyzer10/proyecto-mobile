
import { AuthService } from "@/auth/application/AuthService";
import { Auth } from "@/auth/domain/Auth";
import { AuthController } from "@/auth/infrastructure/controllers/auth-controller";
/**
 * @export
 * @class AppContext
 * @description Clase que representa la configuracion global de la aplicacion
 * @author Angel Zambrano
 */
export class AppContext {
    
    public static getAuthControllerInstance() : AuthController {
        const authService = new AuthService()
        return new AuthController(authService);
    }
    
    
    public static eventSetup() : void {

    }

}