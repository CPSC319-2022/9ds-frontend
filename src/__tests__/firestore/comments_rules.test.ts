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

describe('Testing firestore comment security rules', () => {
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
        // setDoc(doc(firestoreWithoutRule, "article", contributorPrivateArticleID), contributorPrivateArticle),
        // setDoc(doc(firestoreWithoutRule, "article", adminPublishedArticleID), adminPublishedArticle),
        // setDoc(doc(firestoreWithoutRule, "article", adminPrivateArticleID), adminPrivateArticle)
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

  describe('read requests', () => {
    it('should allow all users to read a comment', async () => {

    })
  })

  describe('create requests', () => {
    it("should signed in users to post comments as themselves", async() => {

    })

    it("should not allow signed in users to post comments as others", async() => {

    })

    it("should not allow visitors to post comments", async() => {

    })
  })

  describe('update requests', () => {
    it("should signed in users to update their own comment", async() => {

    })

    it("should not allow signed in users to edit other's comments", async() => {

    })

    it("should not allow signed in users to edit the author of the comment", async() => {

    })

    it("should not allow visitors to edit comments", async() => {

    })
  })

  describe('delete requests', () => {
    it("should signed in users to delete their own comment", async() => {

    })

    it("should not allow readers and contributors to delete other's comments", async() => {

    })

    it("should allow admins to delete other's comments", async() => {

    })

    it("should not allow visitors to delete comments", async() => {

    })
  })

  // it('Should not allow visitors to read users collection', async () => {
  //   const readUser = visitor.firestore().collection('users')
  //     .doc('authUser123').get()
  //   await firebase.assertFails(readUser);
  // });

  // it('Should not allow visitors to read users collection', async () => {
  //   const readUser = visitor.firestore().collection('users')
  //     .doc('authUser123').get()
  //   await firebase.assertFails(readUser);
  // });
});
