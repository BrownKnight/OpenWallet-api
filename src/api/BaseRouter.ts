import express, { Router } from "express";

export abstract class BaseRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}
