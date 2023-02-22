/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";

const PROJECT_ID = "pwc-9ds";

describe('Testing firestore user security rules', () => {
  let testEnv: firebase.RulesTestEnvironment;
  let author: firebase.RulesTestContext;
  let nonAuthorContributor: firebase.RulesTestContext;
  let reader: firebase.RulesTestContext;
  let visitor: firebase.RulesTestContext;

  beforeAll(async () => {
    testEnv = await firebase.initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
        host: 'localhost',
        port: 8080
      }
    })
  });

  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(context => {
      const firestoreWithoutRule = context.firestore()
      return firestoreWithoutRule
        .collection('users')
        .doc('author123')
        .set({contributor: true, username: 'Andy'})
    });
    await testEnv.withSecurityRulesDisabled(context => {
      const firestoreWithoutRule = context.firestore();
      return firestoreWithoutRule
        .collection('users')
        .doc('reader456')
        .set({contributor: false, username: 'Jerry'})
    });
    await testEnv.withSecurityRulesDisabled(context => {
      const firestoreWithoutRule = context.firestore();
      return firestoreWithoutRule
        .collection('users')
        .doc('nonAuthorContributor999')
        .set({contributor: true, username: 'Asem'})
    });
    author = testEnv.authenticatedContext('author123');
    nonAuthorContributor = testEnv.authenticatedContext('nonAuthorContributor999');
    reader = testEnv.authenticatedContext('reader456');
    visitor = testEnv.unauthenticatedContext();
  });

  // Scenario for the 3 tests below: authenticated users can view user profiles
  it('Should not allow visitors to read users collection', async () => {
    const testDoc = visitor.firestore().collection('users')
      .doc();
    const getUser = testDoc.get();
    await firebase.assertFails(getUser);
  });

  it('Should allow readers to read users collection', async () => {
    const testDoc = reader.firestore().collection('users')
      .doc();
    const getUser = testDoc.get();
    await firebase.assertSucceeds(getUser);
  });

  it('Should allow contributors to read users collection', async () => {
    let testDoc = nonAuthorContributor.firestore().collection('users')
      .doc();
    let getUser = testDoc.get();
    await firebase.assertSucceeds(getUser);
    testDoc = author.firestore().collection('users')
      .doc();
    getUser = testDoc.get();
    await firebase.assertSucceeds(getUser);
  });

  // Assumption: all authenticated users will be logged out
  it('Should only allow visitors to create new users', async () => {
    let testCollection = visitor.firestore().collection('users');
    let createUser = testCollection.add({
      contributor: false, username: '9Dudes'
    });
    await firebase.assertSucceeds(createUser);
    testCollection = reader.firestore().collection('users');
    createUser = testCollection.add({
      contributor: false, username: '8Dudes'
    });
    await firebase.assertFails(createUser);
    testCollection = nonAuthorContributor.firestore().collection('users');
    createUser = testCollection.add({
      contributor: false, username: '7Dudes'
    });
    await firebase.assertFails(createUser);
    testCollection = author.firestore().collection('users');
    createUser = testCollection.add({
      contributor: false, username: '6Dudes'
    });
    await firebase.assertFails(createUser);
  });

  // Scenario: Authenticated users can update their own profile

});
