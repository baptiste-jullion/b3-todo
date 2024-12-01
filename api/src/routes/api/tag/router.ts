import { createTag, deleteTag, getTagById, getTags, updateTag } from "@c/tag";
import { Router } from "express";

const router = Router();

router.get("/", getTags);
router.get("/:id", getTagById);
router.post("/", createTag);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
