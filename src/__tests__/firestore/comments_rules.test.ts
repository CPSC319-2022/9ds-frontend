/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";
import {addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {
  adminComment,
  adminCommentId,
  adminData,
  contributorComment, contributorCommentId,
  contributorData,
  contributorPublishedArticle,
  contributorPublishedArticleID, readerComment, readerCommentId,
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
        setDoc(doc(firestoreWithoutRule, `article/${contributorPublishedArticleID}/comments`, adminCommentId), adminComment),
        setDoc(doc(firestoreWithoutRule, `article/${contributorPublishedArticleID}/comments`, contributorCommentId), contributorComment),
        setDoc(doc(firestoreWithoutRule, `article/${contributorPublishedArticleID}/comments`, readerCommentId), readerComment)
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
      await firebase.assertSucceeds(getDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, adminCommentId)))
      await firebase.assertSucceeds(getDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, adminCommentId)))
      await firebase.assertSucceeds(getDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, adminCommentId)))
      await firebase.assertSucceeds(getDoc(doc(visitor, `article/${contributorPublishedArticleID}/comments`, adminCommentId)))
    })

    it('should not allow users to read a comment that does not exist', async() => {
      await firebase.assertFails(getDoc(doc(admin, `article/${contributorPublishedArticleID}/comments/`, "-1")))
    })
  })

  describe('create requests', () => {
    it("should allow signed in users to post comments as themselves", async() => {
      await firebase.assertSucceeds(addDoc(collection(admin, `article/${contributorPublishedArticleID}/comments/`), adminComment));
      await firebase.assertSucceeds(addDoc(collection(contributor, `article/${contributorPublishedArticleID}/comments/`), contributorComment));
      await firebase.assertSucceeds(addDoc(collection(reader, `article/${contributorPublishedArticleID}/comments/`), readerComment));
    })

    it("should not allow signed in users to post comments as others", async() => {
      await firebase.assertFails(addDoc(collection(admin, `article/${contributorPublishedArticleID}/comments/`), contributorComment));
      await firebase.assertFails(addDoc(collection(contributor, `article/${contributorPublishedArticleID}/comments/`), adminComment));
      await firebase.assertFails(addDoc(collection(reader, `article/${contributorPublishedArticleID}/comments/`), adminComment));
    })

    it("should not allow visitors to post comments", async() => {
      await firebase.assertFails(addDoc(collection(visitor, `article/${contributorPublishedArticleID}/comments/`), contributorComment));
    })

    //field control, for later robustness
  })

  describe('update requests', () => {
    it("should allow signed in users to update their own comment", async() => {
      await firebase.assertSucceeds(updateDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, adminCommentId), {content: "New comment"}))
      await firebase.assertSucceeds(updateDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, contributorCommentId), {content: "New comment"}))
      await firebase.assertSucceeds(updateDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, readerCommentId), {content: "New comment"}))
    })

    it("should not allow signed in users to edit other's comments", async() => {
      await firebase.assertFails(updateDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, contributorCommentId), {content: "New comment"}))
      await firebase.assertFails(updateDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, adminCommentId), {content: "New comment"}))
      await firebase.assertFails(updateDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, adminCommentId), {content: "New comment"}))
    })

    it("should not allow signed in users to edit the author of the comment", async() => {
      await firebase.assertFails(updateDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, adminCommentId), {commenter_uid: contributorData.uid}))
      await firebase.assertFails(updateDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, contributorCommentId), {commenter_uid: adminData.uid}))
      await firebase.assertFails(updateDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, readerCommentId), {commenter_uid: adminData.uid}))
    })

    it("should not allow visitors to edit comments", async() => {
      await firebase.assertFails(updateDoc(doc(visitor, `article/${contributorPublishedArticleID}/comments`, adminCommentId), {content: "New comment"}))
    })

    //field control, for later robustness
  })

  describe('delete requests', () => {
    it("should allow signed in users to delete their own comment", async() => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, adminCommentId)))
      await firebase.assertSucceeds(deleteDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, contributorCommentId)))
      await firebase.assertSucceeds(deleteDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, readerCommentId)))
    })

    it("should not allow readers and contributors to delete other's comments", async() => {
      await firebase.assertFails(deleteDoc(doc(contributor, `article/${contributorPublishedArticleID}/comments`, readerCommentId)))
      await firebase.assertFails(deleteDoc(doc(reader, `article/${contributorPublishedArticleID}/comments`, contributorCommentId)))
    })

    it("should allow admins to delete other's comments", async() => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, readerCommentId)))
      await firebase.assertSucceeds(deleteDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, contributorCommentId)))
    })

    it("should not allow visitors to delete comments", async() => {
      await firebase.assertFails(deleteDoc(doc(visitor, `article/${contributorPublishedArticleID}/comments`, readerCommentId)))
    })

    it("should not return error when deleting a comment that does not exist", async() => {
      await firebase.assertSucceeds(deleteDoc(doc(admin, `article/${contributorPublishedArticleID}/comments`, "-1")))
    })
  })

});
