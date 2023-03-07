/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import {doc, setDoc, getDoc, collection, addDoc, serverTimestamp, deleteDoc, updateDoc} from "firebase/firestore";
import * as fs from "fs";
import {
  adminData,
  adminPublishedArticle,
  adminPrivateArticle,
  contributorData,
  contributorPublishedArticle,
  contributorPrivateArticle,
  readerData,
  contributorPublishedArticleID, contributorPrivateArticleID, adminPublishedArticleID, adminPrivateArticleID
} from "./firestore_testing_data";
import fb from "firebase/compat";
import Firestore = fb.firestore.Firestore;

const PROJECT_ID = "ds-blog-local";

describe('Testing firestore article security rules', () => {
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

  describe('read requests', () => {
    it('should allow any user to read a published document', async () => {
      await firebase.assertSucceeds(getDoc(doc(admin, `/article/`, contributorPublishedArticleID)))
      await firebase.assertSucceeds(getDoc(doc(contributor, `/article/`, contributorPublishedArticleID)))
      await firebase.assertSucceeds(getDoc(doc(reader, `/article/`, contributorPublishedArticleID)))
      await firebase.assertSucceeds(getDoc(doc(visitor, `/article/`, contributorPublishedArticleID)))
    })

    it('should the author to read a draft document', async () => {
      await firebase.assertSucceeds(getDoc(doc(admin, `/article/`, adminPrivateArticleID)))
      await firebase.assertSucceeds(getDoc(doc(contributor, `/article/`, contributorPrivateArticleID)))
    })

    it('should not allow any user to read another author\'s draft document', async () => {
      await firebase.assertFails(getDoc(doc(admin, `/article/`, contributorPrivateArticleID)))
      await firebase.assertFails(getDoc(doc(contributor, `/article/`, adminPrivateArticleID)))
      await firebase.assertFails(getDoc(doc(reader, `/article/`, contributorPrivateArticleID)))
      await firebase.assertFails(getDoc(doc(visitor, `/article/`, contributorPrivateArticleID)))
    })

    it("should not be able to read a non-existant document", async() => {
      await firebase.assertFails(getDoc(doc(admin, `/article/`, "-1")))
    })
  })

  describe("create requests", () => {
    it('should not allow visitors to post an article', async () => {
      await firebase.assertFails(addDoc(collection(visitor, "article"), {
        author_uid: "null",
        author_image: "https:example.com/img.jpg",
        author_username: "visitor",
        content: "This is the article body.",
        edit_time: serverTimestamp(),
        header_image: "https:example.com/img.jpg",
        published: false,
        title: "This is the title"
      }))
    })

    it('should not allow readers to post an article', async () => {
      await firebase.assertFails(addDoc(collection(reader, "article"), {
        author_uid: readerData.uid,
        author_image: readerData.profile_image,
        author_username: readerData.username,
        content: "This is the article body.",
        edit_time: serverTimestamp(),
        header_image: "https:example.com/img.jpg",
        published: false,
        title: "This is the title"
      }))
    })

    it('should allow contributors to post an article as themself', async () => {
      await firebase.assertSucceeds(addDoc(collection(contributor, "article"), contributorPublishedArticle))
      await firebase.assertSucceeds(addDoc(collection(contributor, "article"), contributorPrivateArticle))
    })

    it('should not allow contributors to post an article as another user', async () => {
      await firebase.assertFails(addDoc(collection(contributor, "article"), adminPublishedArticle))
    })

    it('should allow admins to post an article as themself', async () => {
      await firebase.assertSucceeds(addDoc(collection(admin, "article"), adminPublishedArticle))
      await firebase.assertSucceeds(addDoc(collection(admin, "article"), adminPrivateArticle))
    })

    it('should not allow admins to post an article as another user', async () => {
      await firebase.assertFails(addDoc(collection(admin, "article"), contributorPublishedArticle))
    })

    // it('should not allow articles missing fields', () => {
    //
    // })
    //
    // it('should not allow articles with extra fields', () => {
    //
    // })

  })

  describe('update requests', () => {
    it('should let contributors edit their own post, with an edit time', async () => {
      await firebase.assertSucceeds(updateDoc(doc(contributor, "article", contributorPrivateArticleID), contributorPublishedArticle))
    })

    it('should not let contributors edit their own post, without an edit time', async () => {
      await firebase.assertFails(updateDoc(doc(contributor, "article", contributorPrivateArticleID), {content: "New article body"}))
    })

    it('should not let contributors edit the author of their own post', async () => {
      await firebase.assertFails(updateDoc(doc(contributor, "article", contributorPrivateArticleID),
          {edit_time: serverTimestamp(), author_uid: adminData.uid}))
    })

    it("should not let contributors edit other's posts", async () => {
      await firebase.assertFails(updateDoc(doc(contributor, "article", adminPrivateArticleID),
          {edit_time: serverTimestamp(), content: "New article body"}))
    })

    it('should let admins edit their own post, with an edit time', async () => {
      await firebase.assertSucceeds(updateDoc(doc(admin, "article", adminPrivateArticleID), adminPublishedArticle))
    })

    it('should not let admins edit their own post, without an edit time', async () => {
      await firebase.assertFails(updateDoc(doc(admin, "article", adminPrivateArticleID), {content: "New article body"}))
    })

    it('should not let admins edit the author of their own post', async () => {
      await firebase.assertFails(updateDoc(doc(admin, "article", adminPrivateArticleID),
          {edit_time: serverTimestamp(), author_uid: contributorData.uid}))
    })

    it("should not let admins edit other's posts", async () => {
      await firebase.assertFails(updateDoc(doc(admin, "article", contributorPrivateArticleID),
          {edit_time: serverTimestamp(), content: "New article body"}))
    })

    it("should not allow edits on a non-existant article", async() => {
      await firebase.assertFails(updateDoc(doc(admin, "article", "-1"), adminPublishedArticle))
    })

    //not worth testing visitor/reader, no interesting behaviour
    //controlling updated fields? -if for later robustness maybe
  })

  describe("delete requests", () => {
    it("should let contributors delete their own posts", async () => {
      await firebase.assertSucceeds(deleteDoc(doc(contributor, `/article/`, contributorPublishedArticleID)))
      await firebase.assertSucceeds(deleteDoc(doc(contributor, `/article/`, contributorPrivateArticleID)))
    })

    it("should not let contributors delete other's posts", async () => {
      await firebase.assertFails(deleteDoc(doc(contributor, `/article/`, adminPublishedArticleID)))
    })

    it("should let admins delete their own posts", async () => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `/article/`, adminPublishedArticleID)))
      await firebase.assertSucceeds(deleteDoc(doc(admin, `/article/`, adminPrivateArticleID)))
    })

    it("should let admins delete other's posts", async () => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `/article/`, contributorPublishedArticleID)))
    })

    it("should not let readers delete posts", async () => {
      await firebase.assertFails(deleteDoc(doc(reader, `/article/`, adminPublishedArticleID)))
    })

    it("should not let visitors delete posts", async () => {
      await firebase.assertFails(deleteDoc(doc(visitor, `/article/`, adminPublishedArticleID)))
    })

    it("should not return an error when deleting an article that does not exist", async () => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `/article/`, "-1")))
    })
  })
});
