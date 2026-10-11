import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { getWordInfo } from "../controllers/words.ctrl.js";

const router = express.Router();

router.get("/:word", asyncWrapper(getWordInfo));

export default router;
