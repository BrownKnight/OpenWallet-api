import { TokenPayload } from "@service/UserLoginService";
import { Request, Response } from "express";

export function getMockResponse(): Response {
  const resMock: jest.Mock<Response> = jest.fn();
  const res = new resMock();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

export function getMockRequest({
  body = {},
  headers = {},
  path = "/random-endpoint",
  user = undefined,
}: {
  body?: { [key: string]: unknown };
  headers?: Request["headers"];
  path?: string;
  user?: TokenPayload;
}): Request {
  const reqMock: jest.Mock<Request> = jest.fn();
  const req = new reqMock();

  req.body = body;
  req.headers = headers;
  req.path = path;
  req.user = user;

  return req;
}
