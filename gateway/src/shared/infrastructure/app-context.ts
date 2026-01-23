
import { AuthService } from "@/auth/application/AuthService";
import { Auth } from "@/auth/domain/Auth";
import { AuthController } from "@/auth/infrastructure/controllers/auth-controller";
import { Logger } from "./logger";
import { HttpService } from "../application/http.service";
import { UserController } from "@/user/infrastructure/controllers/user-controller";
import { UserService } from "@/user/application/userService";
import { CourseService } from "@/course/application/course-service";
import { CourseController } from "@/course/infrastructure/controllers/course-controller";
import { AssignmentService } from "@/assignment/application/assignment-service";
import { AssignmentController } from "@/assignment/infrastructure/controllers/assignment-controller";
import { MoodleProxyController } from "@/auth/infrastructure/controllers/moodle-proxy-controller";
import { TokenValidator } from "@/auth/infrastructure/helper/validate-token";
import { TokenResolver } from "@/auth/infrastructure/helper/token-resolver";
/**
 * @export
 * @class AppContext
 * @description Clase que representa la configuracion global de la aplicacion
 * @author Angel Zambrano
 */
export class AppContext {
    private static logger: Logger = new Logger();
    private static _validationToken:TokenValidator = new TokenValidator();

    private static _httpService: HttpService = new HttpService(this.logger);
    private static _userService: UserService = new UserService(this._httpService, this.logger);
    private static _tokenResolver: TokenResolver = new TokenResolver();

    public static getAuthControllerInstance(): AuthController {
        const authService = new AuthService(this.logger,this._validationToken,this._userService,this._tokenResolver);
        return new AuthController(authService);
    }

    public static getUserControllerInstance(): UserController {
        const userController = new UserController(this._httpService, this._userService);
        return userController;
    }

    public static getCourseControllerInstance(): CourseController {
        const courseService = new CourseService(this._httpService, this.logger);
        return new CourseController(courseService);
    }

    public static getAssignmentControllerInstance(): AssignmentController {
        const assignmentService = new AssignmentService(this._httpService, this.logger);
        return new AssignmentController(assignmentService);
    }

    public static getMoodleProxyControllerInstance(): MoodleProxyController {
        return new MoodleProxyController(this.logger);
    }

    public static eventSetup(): void {

    }

}