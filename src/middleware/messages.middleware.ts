import { NextFunction, Request, Response } from 'express';

export const messagesMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Initialize app.locals.messages if it doesn't exist
  if (!req.app.locals.messages) {
    req.app.locals.messages = {};
  }
  
  // Make messages available to all views
  res.locals.messages = req.app.locals.messages;
  
  next();
};
