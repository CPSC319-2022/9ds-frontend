/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";
import {doc, setDoc} from "firebase/firestore";
import {
  adminData, adminPrivateArticle, adminPrivateArticleID, adminPublishedArticle, adminPublishedArticleID,
  contributorData, contributorPrivateArticle, contributorPrivateArticleID,
  contributorPublishedArticle,
  contributorPublishedArticleID,
  readerData
} from "./firestore_testing_data";
import fb from "firebase/compat";
import Firestore = fb.firestore.Firestore;

const PROJECT_ID = "ds-blog-local";

describe('Testing firestore user security rules', () => {
  let testEnv: firebase.RulesTestEnvironment;
  let visitor: Firestore;
  let reader: Firestore;
  let contributor: Firestore;
  let admin: Firestore;

  beforeAll(async () => {
    testEnv = await firebase.initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
        host: 'localhost',
        port: 8080
      }
    })
    await testEnv.clearFirestore()
  });

  beforeEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const firestoreWithoutRule = context.firestore()
      await Promise.all([
        setDoc(doc(firestoreWithoutRule, "users", adminData.uid),
            {username: adminData.username, profile_image: adminData.profile_image, role: adminData.role}),
        setDoc(doc(firestoreWithoutRule, "users", contributorData.uid),
            {username: contributorData.username, profile_image: contributorData.profile_image, role: contributorData.role}),
        setDoc(doc(firestoreWithoutRule, "users", readerData.uid),
            {username: readerData.username, profile_image: readerData.profile_image, role: readerData.role}),
        setDoc(doc(firestoreWithoutRule, "article", contributorPublishedArticleID), contributorPublishedArticle),
        setDoc(doc(firestoreWithoutRule, "article", contributorPrivateArticleID), contributorPrivateArticle),
        setDoc(doc(firestoreWithoutRule, "article", adminPublishedArticleID), adminPublishedArticle),
        setDoc(doc(firestoreWithoutRule, "article", adminPrivateArticleID), adminPrivateArticle)
      ]);
    });
    admin = testEnv.authenticatedContext(adminData.uid).firestore();
    contributor = testEnv.authenticatedContext(contributorData.uid).firestore();
    reader = testEnv.authenticatedContext(readerData.uid).firestore();
    visitor = testEnv.unauthenticatedContext().firestore();
  });

  afterAll(() => {
    testEnv.cleanup()
  })

  describe("read requests", () => {
    it("should not let visitors get individual users", async () => {

    })

    it("should let signed in users get themselves", async () => {

    })

    //other features unclear, waiting for ahnaf
  })

  describe("create requests", () => {
    it("should allow signed in users to create themselves as reader, if they do not exist", async() => {

    })

    it("should not allow signed in users to create themselves as a non-reader role, if they do not exist", async() => {

    })

    it("should not allow signed in users to create themselves as readers, if they already exist", async() => {

    })

    it("should not allow non-signed in users to create a user", async () => {

    })
  })

  describe("update requests", () => {
    it("should allow signed users to update their username", async() => {

    })

    it("should allow signed in users to update their profile_image", async() => {

    })

    it("should not allow visitors to update users", async() => {

    })

    it("should not allow readers or contributors to update their own role", async() => {

    })

    it("should allow admins to update the roles of all users, to allowed role types", async() => {

    })

    it("should not allow admins to update the roles of users to non allowed role types", async() => {

    })

    it("should not allow admins to update non-role fields", async() => {

    })

    //field control, for later robustness
  })

  describe("delete requests", () => {
    it("should allow signed users to delete themselves", async() => {

    })

    it("should not allow signed in users to delete other users", async() => {

    })

    it("should not allow visitors to delete users", async() => {

    })
  })
});
