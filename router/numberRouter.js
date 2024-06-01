import express from "express";
import { fetchNumbers } from "../controllers/numberController.js";

const router = express.Router();
router.get('/:numberid', fetchNumbers);
export default router;
