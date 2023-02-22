import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";

const PROJECT_ID = "firestore-emulator-test";

describe('Testing firestore security rules', () => {
  let testEnv: firebase.RulesTestEnvironment;
  let authenticatedUser: firebase.RulesTestContext;
  let unauthenticatedUser: firebase.RulesTestContext;

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
        .doc('authUser123')
        .set({name: 'Andy'})
    });
    authenticatedUser = testEnv.authenticatedContext('authUser123');
    unauthenticatedUser = testEnv.unauthenticatedContext();
  });

  it('Should not allow unauthenticated users to read users collection', async () => {
    const readUser = unauthenticatedUser.firestore().collection('users')
      .doc('authUser123').get()
    await firebase.assertFails(readUser);
  });
});
