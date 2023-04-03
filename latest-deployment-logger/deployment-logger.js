// https://alonge.medium.com/how-to-setup-slack-integration-for-google-cloud-build-using-cloud-functions-e357b580c7a1
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();

const WORKING_STATUS = 'WORKING';
const COLLECTION = "pipelineUI";
const DOC = "currentDeployment";
const DEPLOYMENT_TRIGGER_ID = process.env.TRIGGER_ID;

module.exports.logDeployment = pubsubMessage => {
    const build = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
    if (build.status !== WORKING_STATUS) return;
    if (build.buildTriggerId !== DEPLOYMENT_TRIGGER_ID) return;
    (async () => {
        await writeDeploymentToDB(build);
    })();
}

async function writeDeploymentToDB(build) {
    const document = firestore.collection(COLLECTION).doc(DOC);
    await document.set({
        logsBucket: build.logsBucket,
        buildId: build.id
    });
}