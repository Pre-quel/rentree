import { Router, Request, Response, NextFunction } from 'express';
import { connectDB } from '../utils/db';
import { generatePasteId, isValidPasteId } from '../utils/idGenerator';
import { PasteDocument } from '../types';
import { sanitizeMarkdown, sanitizeId } from '../utils/sanitizer';
import { hashEditCode, verifyEditCode } from '../utils/crypto';
import { validateCreatePaste, validateUpdatePaste, validatePasteId } from '../middleware/validation';

const router = Router();

// Get paste by ID
router.get('/:id', validatePasteId, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = sanitizeId(req.params.id);

    const db = await connectDB();
    const paste = await db.collection<PasteDocument>('pastes').findOne({ _id: id });

    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // Don't send editCode hash to client, but indicate if paste is protected
    const { editCode, ...pasteData } = paste;
    res.json({ 
      paste: {
        ...pasteData,
        hasEditCode: !!editCode
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new paste
router.post('/', validateCreatePaste, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, editCode, urlSegment } = req.body;
    const sanitizedContent = sanitizeMarkdown(content);

    const db = await connectDB();
    let id: string;

    // Use custom URL if provided and valid, otherwise generate
    if (urlSegment && isValidPasteId(urlSegment)) {
      const sanitizedUrlSegment = sanitizeId(urlSegment);
      
      // Check if URL is already taken
      const existing = await db.collection<PasteDocument>('pastes').findOne({ _id: sanitizedUrlSegment });
      if (existing) {
        return res.status(409).json({ error: 'URL already taken' });
      }
      
      id = sanitizedUrlSegment;
    } else {
      // Generate unique ID
      let exists = true;
      while (exists) {
        id = generatePasteId();
        const existing = await db.collection<PasteDocument>('pastes').findOne({ _id: id });
        exists = !!existing;
      }
    }

    const newPaste: PasteDocument = {
      _id: id!,
      content: sanitizedContent,
      ...(editCode && { editCode: await hashEditCode(editCode) }),
      createdAt: new Date(),
    };

    await db.collection<PasteDocument>('pastes').insertOne(newPaste);

    // Don't send editCode back
    const { editCode: _, ...responseData } = newPaste;
    res.status(201).json({ paste: responseData });
  } catch (error) {
    next(error);
  }
});

// Update existing paste
router.put('/:id', validateUpdatePaste, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = sanitizeId(req.params.id);
    const { content, editCode, newEditCode } = req.body;
    const sanitizedContent = sanitizeMarkdown(content);

    const db = await connectDB();
    const existingPaste = await db.collection<PasteDocument>('pastes').findOne({ _id: id });

    if (!existingPaste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // Check edit code if paste is protected
    if (existingPaste.editCode) {
      if (!editCode || !(await verifyEditCode(editCode, existingPaste.editCode))) {
        return res.status(403).json({ error: 'Invalid edit code' });
      }
    }

    const updateData: any = {
      content: sanitizedContent,
      updatedAt: new Date()
    };
    
    // Allow changing edit code
    if (newEditCode) {
      updateData.editCode = await hashEditCode(newEditCode);
    }
    
    const updatedPaste = await db.collection<PasteDocument>('pastes').findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updatedPaste) {
      return res.status(404).json({ error: 'Failed to update paste' });
    }

    // Don't send editCode back
    const { editCode: _, ...responseData } = updatedPaste;
    res.json({ paste: responseData });
  } catch (error) {
    next(error);
  }
});

export default router;