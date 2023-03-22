/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc, getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import {
  adminComment,
  adminCommentId,
  adminData, adminPrivateArticle, adminPrivateArticleID, adminPublishedArticle, adminPublishedArticleID,
  contributorComment,
  contributorCommentId,
  contributorData,
  contributorPrivateArticle,
  contributorPrivateArticleID,
  contributorPublishedArticle,
  contributorPublishedArticleID,
  newUserData,
  readerComment,
  readerCommentId,
  readerData
} from "./firestore_testing_data";
import fb from "firebase/compat";
import Firestore = fb.firestore.Firestore;

const PROJECT_ID = "ds-blog-local";

describe('Testing firestore security rules', () => {
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

  afterAll(() => {
    testEnv.clearFirestore()
    testEnv.cleanup()
  })

  describe('User', () => {
    let newUser: Firestore;

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
              {username: readerData.username, profile_image: readerData.profile_image, role: readerData.role})
        ]);
      });
      admin = testEnv.authenticatedContext(adminData.uid).firestore();
      contributor = testEnv.authenticatedContext(contributorData.uid).firestore();
      reader = testEnv.authenticatedContext(readerData.uid).firestore();
      newUser = testEnv.authenticatedContext(newUserData.uid).firestore();
      visitor = testEnv.unauthenticatedContext().firestore();
    });

    describe("read requests", () => {
      it("should not let visitors get user data", async () => {
        await firebase.assertFails(getDoc(doc(visitor, "users", contributorData.uid)))
      })

      it("should let signed in users get their own user data", async () => {
        await firebase.assertSucceeds(getDoc(doc(admin, "users", adminData.uid)))
        await firebase.assertSucceeds(getDoc(doc(contributor, "users", contributorData.uid)))
        await firebase.assertSucceeds(getDoc(doc(reader, "users", readerData.uid)))
      })

      it("should not let readers and contributors get other users", async() => {
        await firebase.assertFails(getDoc(doc(contributor, "users", adminData.uid)))
        await firebase.assertFails(getDoc(doc(reader, "users", adminData.uid)))
      })

      it("should let admins read get any user", async() => {
        await firebase.assertSucceeds(getDoc(doc(admin, "users", adminData.uid)))
        await firebase.assertSucceeds(getDoc(doc(admin, "users", contributorData.uid)))
        await firebase.assertSucceeds(getDoc(doc(admin, "users", readerData.uid)))
      })

      it("should let admins query any user", async() => {
        await firebase.assertSucceeds(getDocs(query(collection(admin, "users"))))
      })
    })

    describe("create requests", () => {
      it("should allow signed in users to create themselves as reader", async() => {
        await firebase.assertSucceeds(setDoc(doc(newUser, "users", newUserData.uid),
            {username: newUserData.username, profile_image: newUserData.profile_image, role: newUserData.role}))
      })

      it("should not allow signed in users to create a user with a different uid", async() => {
        await firebase.assertFails(setDoc(doc(newUser, "users", "non-existant-uid"),
            {username: newUserData.username, profile_image: newUserData.profile_image, role: newUserData.role}))
      })

      it("should not allow signed in users to create themselves as a non-reader role", async() => {
        await firebase.assertFails(setDoc(doc(newUser, "users", newUserData.uid),
            {username: newUserData.username, profile_image: newUserData.profile_image, role: "contributor"}))
      })

      it("should not allow non-signed in users to create a user", async () => {
        await firebase.assertFails(setDoc(doc(visitor, "users", newUserData.uid),
            {username: newUserData.username, profile_image: newUserData.profile_image, role: newUserData.role}))
      })
    })

    describe("update requests", () => {
      it("should allow signed users to update their username", async() => {
        await firebase.assertSucceeds(updateDoc(doc(admin, "users", adminData.uid), {username: "newName"}))
        await firebase.assertSucceeds(updateDoc(doc(contributor, "users", contributorData.uid), {username: "newName"}))
        await firebase.assertSucceeds(updateDoc(doc(reader, "users", readerData.uid), {username: "newName"}))
      })

      it("should allow signed in users to update their profile_image", async() => {
        await firebase.assertSucceeds(updateDoc(doc(admin, "users", adminData.uid), {profile_image: "new.jpg"}))
        await firebase.assertSucceeds(updateDoc(doc(contributor, "users", contributorData.uid), {profile_image: "new.jpg"}))
        await firebase.assertSucceeds(updateDoc(doc(reader, "users", readerData.uid), {profile_image: "new.jpg"}))
      })

      it("should not allow readers or contributors to update their own role", async() => {
        await firebase.assertFails(updateDoc(doc(contributor, "users", contributorData.uid), {role: "admin"}))
        await firebase.assertFails(updateDoc(doc(reader, "users", readerData.uid), {role: "admin"}))
      })

      it("should not allow readers or contributors to update other users", async() => {
        await firebase.assertFails(updateDoc(doc(contributor, "users", readerData.uid), {username: "newName"}))
        await firebase.assertFails(updateDoc(doc(reader, "users", contributorData.uid), {username: "newName"}))
      })

      it("should allow admins to update the roles of all users, to allowed role types", async() => {
        await firebase.assertSucceeds(updateDoc(doc(admin, "users", contributorData.uid), {role: "admin"}))
        await firebase.assertSucceeds(updateDoc(doc(admin, "users", readerData.uid), {role: "banned"}))
        await firebase.assertSucceeds(updateDoc(doc(admin, "users", adminData.uid), {role: "reader"}))
      })

      it("should not allow admins to update the roles of users to non allowed role types", async() => {
        await firebase.assertFails(updateDoc(doc(admin, "users", readerData.uid), {role: "moderator"}))
      })

      it("should not allow admins to update non-role fields", async() => {
        await firebase.assertFails(updateDoc(doc(admin, "users", contributorData.uid), {profile_image: "new.jpg", role: "admin"}))
        await firebase.assertFails(updateDoc(doc(admin, "users", readerData.uid), {profile_image: "new.jpg", role: "contributor"}))
      })

      it("should not allow visitors to update users", async() => {
        await firebase.assertFails(updateDoc(doc(visitor, "users", readerData.uid), {username: "newName"}))
      })
    })

    describe("delete requests", () => {
      it("should allow signed users to delete themselves", async() => {
        await firebase.assertSucceeds(deleteDoc(doc(admin, `users/`, adminData.uid)))
        await firebase.assertSucceeds(deleteDoc(doc(contributor, `users/`, contributorData.uid)))
        await firebase.assertSucceeds(deleteDoc(doc(reader, `users`, readerData.uid)))
      })

      it("should not allow signed in users to delete other users", async() => {
        await firebase.assertFails(deleteDoc(doc(admin, `users/`, contributorData.uid)))
        await firebase.assertFails(deleteDoc(doc(contributor, `users/`, adminData.uid)))
        await firebase.assertFails(deleteDoc(doc(reader, `users`, adminData.uid)))
      })

      it("should not allow visitors to delete users", async() => {
        await firebase.assertFails(deleteDoc(doc(visitor, `users/`, contributorData.uid)))
      })
    })
  });

  describe('Articles', () => {

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

  describe('Comments', () => {

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

  it("should reject requests to any other data location", async () => {
    admin = testEnv.authenticatedContext(adminData.uid).firestore();
    await firebase.assertFails(setDoc(doc(admin, "other_location/1"), {content: "Other file"}))
    await firebase.assertFails(getDoc(doc(admin, "other_location/1")))
  })
})


