// code from https://alonge.medium.com/how-to-setup-slack-integration-for-google-cloud-build-using-cloud-functions-e357b580c7a1
// https://github.com/galonge/GCB-Slack-Notifier
// https://nodejs.org/api/stream.html#readablereadsize
// https://github.com/harsh4870/Cloud-build-slack-notification/blob/master/singedURL.js

const { IncomingWebhook } = require('@slack/webhook');
const {Storage} = require('@google-cloud/storage');

// variables for cloud stuff
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
const storage = new Storage();

const cloudbuild_status_color_map = {
    SUCCESS: '#34A853', // green
    FAILURE: '#EA4335', // red
};

// variables for parsing the logs to get test results
const TEST_SUITE_RESULTS_QUERY = 'Test Suites: ';
const UNIT_TEST_RESULTS_QUERY = 'Tests: ';
const TEST_COVERAGE_QUERY = 'All files';
const COVERAGE_SEPARATOR = "|";
const FAILING_TEST_CHAR = Buffer.from('4peP', 'base64').toString()
const TEST_STEP_INDICATOR = "Step #2: ";
const TEST_STEP_END = "Step #3: ";
const NEWLINE_CHAR = "\n";
const TEST_RESULTS_ERROR_MSG = "Tests did not run or results are unavailable";
const TEST_COVERAGE_ERROR_MSG = "Coverage did not run or results are unavailable";
const NO_FAILING_TEST_MESSAGE = "No failing tests detected";

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = pubsubMessage  => {
    const build = eventToBuild(pubsubMessage.data);

    if (Object.keys(cloudbuild_status_color_map).indexOf(build.status) === -1) return; // We don't care about this status

    let current_build_logs = "";

    const logsReadStream = storage.bucket(build.logsBucket).file('log-' + build.id + '.txt').createReadStream();
    
    logsReadStream.on('readable', () => {
        current_build_logs += getCurrentBuildLogs(logsReadStream);
    });

    logsReadStream.on('end', () => {
        const test_step_logs = getTestStepLogs(current_build_logs);
        const test_summary = parseTestResults(test_step_logs);
        // Send message to Slack.
        const message = createSlackMessage(build, test_summary);
        (async () => {
            await webhook.send(message);
        })();
    })
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
    return JSON.parse(Buffer.from(data, 'base64').toString());
};

// parse out test results from logs
const getCurrentBuildLogs = logsReadStream => {
    let logs;
    let current_build_logs = "";
    
    // Use a loop to make sure we read all currently available data
    while (null !== (logs = logsReadStream.read())) {
      current_build_logs += Buffer.from(logs, 'base64').toString();
    }
  
    return current_build_logs;
  }

const getTestStepLogs = current_build_logs => {
    const test_step_start_index = current_build_logs.indexOf(TEST_STEP_INDICATOR);
    const test_step_end_index = current_build_logs.indexOf(TEST_STEP_END);
    return current_build_logs.slice(test_step_start_index, test_step_end_index);
}

const parseTestResults = logs => {
    let breakpoint;

    // parse out test results
    const test_suite_results_index = logs.indexOf(TEST_SUITE_RESULTS_QUERY);
    breakpoint = logs.indexOf(NEWLINE_CHAR, position=test_suite_results_index);
    const test_suite_results = logs.slice(test_suite_results_index, breakpoint);
  
    const unit_test_results_index = logs.indexOf(UNIT_TEST_RESULTS_QUERY);
    breakpoint = logs.indexOf(NEWLINE_CHAR, position=unit_test_results_index);
    const unit_test_results = logs.slice(unit_test_results_index, breakpoint);
    
    const test_results = formatTestResults(test_suite_results, unit_test_results);

    // parse out coverage results
    const test_coverage_index = logs.indexOf(TEST_COVERAGE_QUERY);
    breakpoint = logs.indexOf(NEWLINE_CHAR, position=test_coverage_index);
    const unformatted_coverage_results = logs.slice(test_coverage_index, breakpoint);
    const coverage_results = formatCoverageResults(unformatted_coverage_results);

    // parse out any error messages from tests
    const error_results = formatFailingTestMessages(logs);
  
    const test_summary = {
      test_results: test_results,
      coverage_results: coverage_results,
      error_results: error_results
    };
  
    return test_summary;
}

const formatTestResults = (test_suite_results, unit_test_results) => {
    if (test_suite_results === '' || unit_test_results === '') return TEST_RESULTS_ERROR_MSG;
    return test_suite_results + NEWLINE_CHAR + unit_test_results;
}

const formatCoverageResults = unformatted_coverage_results => {
    if (unformatted_coverage_results === '') return TEST_COVERAGE_ERROR_MSG;
    
    const coverage_results_array = unformatted_coverage_results.split(COVERAGE_SEPARATOR);
    let results = '';
    results += 'Statements: ' + coverage_results_array[1] + '%' + NEWLINE_CHAR;
    results += 'Branches: ' + coverage_results_array[2] + '%' + NEWLINE_CHAR;
    results += 'Functions: ' + coverage_results_array[3] + '%' + NEWLINE_CHAR;
    results += 'Lines: ' + coverage_results_array[4] + '%' + NEWLINE_CHAR;
    return results;
}

const formatFailingTestMessages = logs => {
    let breakpoint = 0;
    let failing_test_char_index;
    let curr_error_message;
    let results = '';
  
    while((failing_test_char_index = logs.indexOf(FAILING_TEST_CHAR, breakpoint)) !== -1) {
      // grab 3 lines
      breakpoint = logs.indexOf(NEWLINE_CHAR, position=failing_test_char_index);
      breakpoint = logs.indexOf(NEWLINE_CHAR, position=breakpoint + 1);
      breakpoint = logs.indexOf(NEWLINE_CHAR, position=breakpoint + 1);
  
      curr_error_message = logs.slice(failing_test_char_index, breakpoint).split(TEST_STEP_INDICATOR);
      results += curr_error_message[0] + curr_error_message[2] + NEWLINE_CHAR;
    }
  
    return (results === '')? NO_FAILING_TEST_MESSAGE : results;
  }

// createSlackMessage create a message from a build object.
const createSlackMessage = (build, test_summary) => {
    let buildId = build.id;
    let buildCommit = build.substitutions.COMMIT_SHA;
    let branch = build.substitutions.BRANCH_NAME;
    let repo = build.substitutions.REPO_NAME;

    let message = {
        text: `Build - \`${buildId}\``,
        mrkdwn: true,
        attachments: [
            {
                color: cloudbuild_status_color_map[build.status],
                title: 'View Build Logs',
                title_link: build.logUrl,
                fields: [
                    {
                        title: 'Build Status',
                        value: build.status,
                    },
                    {
                        title: 'Test results',
                        value: test_summary.test_results,
                    },
                    {
                        title: 'Coverage results',
                        value: test_summary.coverage_results,
                    },
                    {
                        title: 'Test error messages',
                        value: test_summary.error_results,
                    },
                    {
                        title: 'Repository',
                        value: repo,
                    },
                    {
                        title: 'Branch',
                        value: branch,
                    },
                    {
                        title: 'Commit',
                        value: buildCommit,
                    },
                ],
            }
        ],
    };
    return message;
};