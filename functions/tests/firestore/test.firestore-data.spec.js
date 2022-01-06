const functions = require('firebase-functions-test');
const admin = require('firebase-admin');
const index = require('../../lib/functions/src/index')

// TODO: rewrite to TS with mocha TS OR JEST TS

const testEnv = functions({
  databaseURL: 'https://money-me-4897f.firebaseio.com',
  projectId: 'money-me-4897f',
  storageBucket: 'money-me-4897f.appspot.com',
});

describe('keepCount', () => {
  let wrappedKeepCount;
  let wrappedDecrementCount;

  beforeAll(() => {
    wrappedKeepCount = testEnv.wrap(index.keepCount);
    wrappedDecrementCount = testEnv.wrap(index.decrementCountOnDelete);
  })

  it('should increase count', async () => {
    const path = 'selltokens/testingselltoken';
    const metaRefBefore = await admin.firestore().doc('metadata/selltokens').get();
    const metaDataBefore = metaRefBefore.data().count;
    const data = {
      name: 'testselltoken',
      title: 'testselltoken'
    }

    const snap = testEnv.firestore.makeDocumentSnapshot(data, path);

    await wrappedKeepCount(snap);

    const metaRefAfter = await admin.firestore().doc('metadata/selltokens').get();
    const metaDataAfter = metaRefAfter.data().count;

    expect(metaDataBefore).toBeLessThan(metaDataAfter);
  });
})
