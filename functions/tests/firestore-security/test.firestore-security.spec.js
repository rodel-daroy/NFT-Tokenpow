const assert = require('assert');
const firebase = require('@firebase/testing');

const PROJECT_ID = "money-me-4897f";

describe("User test read, write, update", () => {
  // can read
  it('can read to a user document with the same id as our user', async () => {
    // create user who is connected to db
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"}
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_abc");
    await firebase.assertSucceeds(testDoc.get());
  });

  // can't read
  it('Cant read to a user document with the same id as our user', async () => {
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"};
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_xyz");
    await firebase.assertFails(testDoc.get());
  });

  // can write
  it('can write to a user document with the same id as our user', async () => {
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"};
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_abc");
    await firebase.assertSucceeds(testDoc.set({foo: "foo"}));
  });

  // cant write
  it('cant write to a user document with the same id as our user', async () => {
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"};
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_xyz");
    await firebase.assertFails(testDoc.set({foo: "foo"}));
  });

  // cant update
  it('cant update to a user document with the same id as our user', async () => {
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"};
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_xyz");
    await firebase.assertFails(testDoc.set({foo: "foo"}, {merge: true}));
  });

  // can update
  it('can update to a user document with the same id as our user', async () => {
    const myAuth = {uid: "user_abc", email:"abc@gmail.com"};
    const db = firebase.initializeTestApp({projectId: PROJECT_ID, auth: myAuth}).firestore();
    const testDoc = db.collection("users").doc("user_abc");
    await firebase.assertSucceeds(testDoc.set({foo: "foo"}, {merge: true}));
  });
})
