
import { AuthService } from "@/auth/application/AuthService";
import { Auth } from "@/auth/domain/Auth";
import { AuthController } from "@/auth/infrastructure/controllers/auth-controller";
import { Logger } from "./logger";
import { HttpService } from "../application/http.service";
import { UserController } from "@/user/infrastructure/controllers/user-controller";
import { UserService } from "@/user/application/userService";
/**
 * @export
 * @class AppContext
 * @description Clase que representa la configuracion global de la aplicacion
 * @author Angel Zambrano
 */
export class AppContext {
    private static logger:Logger = new Logger();

    private static _httpService:HttpService = new HttpService(this.logger);
    private static _userService:UserService = new UserService(this._httpService,this.logger);

    public static getAuthControllerInstance() : AuthController {
        const authService = new AuthService(this.logger)
        return new AuthController(authService);
    }

    public static getUserControllerInstance():UserController {
        const userController = new UserController(this._httpService,this._userService);
        return userController;
    }

    public static eventSetup() : void {

    }

}