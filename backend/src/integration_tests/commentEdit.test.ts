import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import {
    dummyExistingUsers,
    fuwanteUserDetails,
    martinUserDetails,
    seedBlogs,
} from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("editing comments", () => {
    test("sucessfully edits a comment", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;
        const comment = "this is a comment";

        const commentRes = await api
            .post("/comment")
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: comment })
            .expect(201);

        const commentId = commentRes.body.data.remote_id;
        const newCommentContent = "this is new comment content";

        await api
            .put(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ content: newCommentContent })
            .expect(200);

        const getUpdatedommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 20 });
        
        const updatedComment = getUpdatedommentsRes.body.data.comments.find(
            //@ts-expect-error no need to type comment here
            (comment) => comment.remote_id === commentId
        );
        expect(updatedComment.remote_id).toBe(commentId);
        expect(updatedComment.content).toBe(newCommentContent);
    });

    test("retruns 404 not found if comment is missing", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const commentId = crypto.randomUUID();
        const newCommentContent = "this is new comment content";

        await api
            .put(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ content: newCommentContent })
            .expect(404);
    });

    test("returns unauthorized 403 if the user updating the comment is not the author of comment", async () => {
        const userDetails = {
            name: martinUserDetails.name,
            password: martinUserDetails.password,
        };
        const api = request(app);

        const martinLoginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const martinToken = martinLoginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;
        const comment = "this is a comment";

        const commentRes = await api
            .post("/comment")
            .set({ authorization: `Bearer ${martinToken}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: comment })
            .expect(201);

        const commentId = commentRes.body.data.remote_id;
        const newCommentContent = "this is new comment content";

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .put(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .send({ content: newCommentContent })
            .expect(403);
    });
});
