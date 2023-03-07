/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";
import {deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {
  adminData,
  contributorData,
  newUserData,
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
  let newUser: Firestore;

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
            {username: readerData.username, profile_image: readerData.profile_image, role: readerData.role})
      ]);
    });
    admin = testEnv.authenticatedContext(adminData.uid).firestore();
    contributor = testEnv.authenticatedContext(contributorData.uid).firestore();
    reader = testEnv.authenticatedContext(readerData.uid).firestore();
    newUser = testEnv.authenticatedContext(newUserData.uid).firestore();
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
    // Anyone can get a list of contributors
    // No one can get a list of readers
    // Signed in user's can read their own user data
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

    //field control, for later robustness
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

    //field control, for later robustness
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
