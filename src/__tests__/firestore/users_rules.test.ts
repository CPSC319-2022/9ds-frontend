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
    await testEnv.clearFirestore();
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
  it('Should not allow visitors to read/query users collection', async () => {
    const testCollection = visitor.firestore().collection('users');
    const getUser = testCollection.doc().get();
    const queryUser = testCollection.where('contributor', '==', true).get();
    await firebase.assertFails(getUser);
    await firebase.assertFails(queryUser);
  });

  it('Should allow readers to read/query users collection', async () => {
    const testCollection = reader.firestore().collection('users');
    const getUser = testCollection.doc().get();
    const queryUser = testCollection.where('contributor', '==', true).get();
    await firebase.assertSucceeds(getUser);
    await firebase.assertSucceeds(queryUser);
  });

  it('Should allow contributors to read/query users collection', async () => {
    let testCollection = nonAuthorContributor.firestore().collection('users');
    let getUser = testCollection.doc().get();
    let queryUser = testCollection.where('contributor', '==', true).get();
    await firebase.assertSucceeds(getUser);
    await firebase.assertSucceeds(queryUser);
    testCollection = author.firestore().collection('users');
    getUser = testCollection.doc().get();
    queryUser = testCollection.where('contributor', '==', true).get();
    await firebase.assertSucceeds(getUser);
    await firebase.assertSucceeds(queryUser);
  });

  // Assumption: all authenticated users will be logged out
  it('Should only allow visitors to create new users once', async () => {
    let testCollection = visitor.firestore().collection('users');
    let addUser = testCollection.add({
      contributor: false, username: 'visitorAndy'
    });
    const setUser = testCollection.doc('unique-id').set({
      contributor: false, username: '9Dudes'
    });
    await firebase.assertSucceeds(addUser);
    await firebase.assertSucceeds(setUser);
    // user-id is already in the db
    await firebase.assertFails(setUser);
    testCollection = reader.firestore().collection('users');
    addUser = testCollection.add({
      contributor: false, username: 'readerAndy'
    });
    await firebase.assertFails(addUser);
    testCollection = nonAuthorContributor.firestore().collection('users');
    addUser = testCollection.add({
      contributor: false, username: 'nonAuthorAndy'
    });
    await firebase.assertFails(addUser);
    testCollection = author.firestore().collection('users');
    addUser = testCollection.add({
      contributor: false, username: 'authorAndy'
    });
    await firebase.assertFails(addUser);
  });

  // // Scenario: Authenticated users can update their own profile
  // it('Should only allow authenticated users to update their own document', () => {
  //   let testCollection = visitor.firestore().collection('users');
  //   let updateUser = testCollection.doc().update({
  //     username:
  //   })
  // })
});
