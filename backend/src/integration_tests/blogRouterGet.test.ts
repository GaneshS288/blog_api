import { describe, test, beforeAll, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";
import { blogGetSetup } from "./integrationTestUtils.ts";

beforeAll(async () => {
    await blogGetSetup();
});

describe("returning blogs from the api", () => {
    test("returns blogs specified in size param", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, size: 6 })
            .expect(200);
        expect(res.body.data.blogs.length).toBe(6);
        expect(res.body.data.count).toBe(8);
    });

    test("pagination works properly", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 2, size: 5 })
            .expect(200);
        expect(res.body.data.blogs.length).toBe(3);
        expect(res.body.data.count).toBe(8);
    });

    test("search by author id works", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 1 })
            .expect(200);

        const fuwanteAuthorId = res.body.data.blogs.find(
            //@ts-expect-error don't need to type the blog return for now
            (blog) => blog.author.name === "fuwante"
        ).author.remote_id;

        const authorIdRes = await api
            .get("/blogs")
            .query({ order: "desc", author_id: fuwanteAuthorId })
            .expect(200);

        expect(authorIdRes.body.data.count).toBe(1);
    });

    test("search by author name works", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        expect(res.body.data.count).toBe(1);
    });

    test("search by blog title works", async () => {
        const api = request(app);
        const blogTitle = "far cry 1 sucks";
        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, title: blogTitle })
            .expect(200);

        expect(res.body.data.count).toBe(1);
    });
});
