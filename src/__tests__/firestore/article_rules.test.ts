/**
 * @jest-environment node
 */

import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";

const PROJECT_ID = "pwc-9ds";

describe('Testing firestore user security rules', () => {
  let testEnv: firebase.RulesTestEnvironment;
  let reader: firebase.RulesTestContext;
  let author: firebase.RulesTestContext;
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
      const firestoreWithoutRule = context.firestore()
      return firestoreWithoutRule
        .collection('article')
        .doc()
        .set({author_uid: 'author123'})
    });
    author = testEnv.authenticatedContext('author123');
    reader = testEnv.authenticatedContext('reader456');
    visitor = testEnv.unauthenticatedContext();
  });

  it('Should not allow visitors to read users collection', async () => {
    const readUser = visitor.firestore().collection('users')
      .doc('authUser123').get()
    await firebase.assertFails(readUser);
  });

  // it('Should not allow visitors to read users collection', async () => {
  //   const readUser = visitor.firestore().collection('users')
  //     .doc('authUser123').get()
  //   await firebase.assertFails(readUser);
  // });
});
