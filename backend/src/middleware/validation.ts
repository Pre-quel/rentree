import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const pasteSchema = Joi.object({
  content: Joi.string().min(1).max(1000000).required(), // 1MB max
  editCode: Joi.string().min(4).max(100).optional(),
  urlSegment: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(1).max(50).optional()
});

const updatePasteSchema = Joi.object({
  content: Joi.string().min(1).max(1000000).required(),
  editCode: Joi.string().min(4).max(100).optional(),
  newEditCode: Joi.string().min(4).max(100).optional()
});

const idSchema = Joi.string().alphanum().min(1).max(50);

export const validateCreatePaste = (req: Request, res: Response, next: NextFunction) => {
  const { error } = pasteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUpdatePaste = (req: Request, res: Response, next: NextFunction) => {
  const { error: bodyError } = updatePasteSchema.validate(req.body);
  const { error: idError } = idSchema.validate(req.params.id);
  
  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }
  if (idError) {
    return res.status(400).json({ error: 'Invalid paste ID format' });
  }
  next();
};

export const validatePasteId = (req: Request, res: Response, next: NextFunction) => {
  const { error } = idSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({ error: 'Invalid paste ID format' });
  }
  next();
};