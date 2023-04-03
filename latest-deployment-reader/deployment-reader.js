const {Firestore} = require('@google-cloud/firestore');
const {Storage} = require('@google-cloud/storage');
const functions = require('@google-cloud/functions-framework');

const firestore = new Firestore();
const storage = new Storage();

const COLLECTION = "pipelineUI";
const DOC = "currentDeployment";
const BUILD_SUCCESS_INDICATOR = "DONE";
const BUILD_FAILURE_INDICATOR = "ERROR";
const WORKING_STATUS = "WORKING";
const CURRENT_STEP_QUERY = "Step #"
const NO_EXISTING_BUILD_RESPONSE = {
    buildId: "DNE",
    status: "DNE",
    current_step: "DNE"
}

functions.http('readDeployment', (req, res) => {
    (async () => {
        const docRef = firestore.collection(COLLECTION).doc(DOC);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            res.send(JSON.stringify(NO_EXISTING_BUILD_RESPONSE));
            return;
        }
        
        const deployment_data = doc.data()

        let current_build_logs = "";

        const logsReadStream = storage.bucket(deployment_data.logsBucket).file('log-' + deployment_data.buildId + '.txt').createReadStream();
    
        logsReadStream.on('readable', () => {
            let logs;
            while (null !== (logs = logsReadStream.read())) {
                current_build_logs += Buffer.from(logs, 'base64').toString();
            }
        });

        logsReadStream.on('end', () => {
            res.send(JSON.stringify(parseCurrentStep(current_build_logs, deployment_data.buildId)));
        })

        logsReadStream.on('error', err => {
            // logs updating, no problem
            res.send(JSON.stringify(parseCurrentStep(current_build_logs, deployment_data.buildId)));
        })
    })();
});

const parseCurrentStep = (logs, buildId) => {
    let status;

    if (logs.indexOf(BUILD_SUCCESS_INDICATOR) !== -1) {
        status = BUILD_SUCCESS_INDICATOR;
    } else if (logs.indexOf(BUILD_FAILURE_INDICATOR) !== -1) {
        status = BUILD_FAILURE_INDICATOR;
    } else {
        status = WORKING_STATUS;
    }

    const latest_step_index = logs.lastIndexOf(CURRENT_STEP_QUERY) + CURRENT_STEP_QUERY.length;

    // get the number right afterwards
    const latest_step = logs.slice(latest_step_index, latest_step_index+1);

    const results = {
        buildId: buildId,
        status: status,
        current_step: latest_step
    }

    return results;
}