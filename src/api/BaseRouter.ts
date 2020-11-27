import express, { Router } from "express";

export abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}
