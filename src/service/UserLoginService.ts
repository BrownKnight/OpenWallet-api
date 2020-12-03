import { UserLoginDAO } from "@db/DAO/UserLoginDAO";
import { UserLogin } from "@db/entity/UserLogin";
import { BaseEntityService } from "@service/BaseEntityService";
import { ServiceResponse } from "./responses/ServiceResponse";
import bcrypt from "bcrypt";
import { LoginResponse } from "./responses/LoginResponse";
import jwt from "jsonwebtoken";
import fs from "fs";
import { UserRole } from "@db/entity/enum/UserRole";

export class UserLoginService extends BaseEntityService<UserLogin> {
  private userLoginDAO;
  constructor() {
    super(UserLoginDAO);
    this.userLoginDAO = new UserLoginDAO();
  }

  /** Fetches UserLogins with the user relation field loaded */
  async getAll(): Promise<ServiceResponse<UserLogin>> {
    const response = new ServiceResponse<UserLogin>();

    response.entities = await this.dao.getAll({ relations: ["user"] });

    return response;
  }

  /** Fetches UserLogin with the user relation field loaded */
  async getById(id: number): Promise<ServiceResponse<UserLogin>> {
    let response = new ServiceResponse<UserLogin>();

    const entity = await this.dao.getByID(id, { relations: ["user"] });
    if (entity) {
      response.entities = [entity];
    } else {
      response = { ...response, success: false, errorCode: 404, errorMessage: `Could not find entity with ID ${id}` };
    }

    return response;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const successResponse = new LoginResponse();
    const unauthorisedResponse = new LoginResponse(false, 401, "Username or Password did not match");

    // Find the user by their username
    const userLogin = await this.userLoginDAO.getByUsername(username);
    if (!userLogin || !userLogin.id || !userLogin.username || !userLogin.password) {
      return unauthorisedResponse;
    }

    let token: string | null = null;
    if (await bcrypt.compare(password, userLogin.password)) {
      // Successful login, generate a token to put into the response, and save that to the entity
      token = await this.generateAuthToken(userLogin.id);
    } else {
      return unauthorisedResponse;
    }

    if (!token) {
      return { ...unauthorisedResponse, errorMessage: "Authenticated, but could not generate token" };
    }

    return { ...successResponse, token: token };
  }

  async loginWithToken(token: string): Promise<LoginResponse> {
    const response = new LoginResponse();

    const verifiedTokenPayload = this.verifyToken(token);
    if (!verifiedTokenPayload) {
      return { ...response, success: false, errorCode: 400, errorMessage: "Could not verify token" };
    }

    return { ...response, token: token, user: verifiedTokenPayload };
  }

  private async generateAuthToken(userId: number): Promise<string | null> {
    const userLogin = (await this.getById(userId))?.entities[0];
    if (!userLogin) {
      console.error(`Could not find user to generate token for. UserID: ${userId}`);
      return null;
    }

    console.log(`Generating token for user ID: ${userId}`);
    const privateKey = fs.readFileSync("authkey", "utf-8");

    // Sign a token containing some limited user info, with the private key
    const token = jwt.sign(
      {
        id: userLogin.id,
        username: userLogin.username,
        user: {
          firstName: userLogin.user?.firstName,
        },
        userRole: userLogin.userRole,
      },
      privateKey,
      { algorithm: "RS512", expiresIn: "1d" }
    );

    // Now that we've generated the token, save it against the user
    // Create a new object for the save so we don't save the password
    this.save({ id: userLogin.id, webToken: token });

    return token;
  }

  private verifyToken(token: string): TokenPayload | null {
    const publicKey = fs.readFileSync("authkey.pub", "utf-8");
    try {
      return jwt.verify(token, publicKey) as TokenPayload;
    } catch (err) {
      return null;
    }
  }
}

export type TokenPayload = {
  id: number;
  username: string;
  user: {
    firstName: string;
  };
  userRole: UserRole;
};
