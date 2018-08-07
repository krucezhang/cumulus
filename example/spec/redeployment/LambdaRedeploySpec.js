'use strict';

const {
  buildAndStartWorkflow,
  waitForCompletedExecution,
  LambdaStep
} = require('@cumulus/integration-tests');

const {
  loadConfig,
  redeploy
} = require('../helpers/testUtils');

const {
  updateLambdaConfiguration
} = require('../helpers/lambdaUtils');

const config = loadConfig();
const lambdaStep = new LambdaStep();

describe('When a workflow', () => {
  describe('is running and a new version of a workflow lambda is deployed', () => {
    let workflowExecutionArn = null;
    let workflowStatus = null;
    let testVersionOutput = null;

    beforeAll(async () => {
      const updateConfig = { handler: 'update.handler' };
      const lambdaName = 'VersionUpTest';
      const lambdaConfigFileName = './lambdas.yml';

      workflowExecutionArn = await buildAndStartWorkflow(
        config.stackName,
        config.bucket,
        'TestLambdaVersionWorkflow'
      );
      updateLambdaConfiguration(lambdaConfigFileName, lambdaName, updateConfig);
      await redeploy(config);
      workflowStatus = await waitForCompletedExecution(workflowExecutionArn);
      testVersionOutput = await lambdaStep.getStepOutput(
        workflowExecutionArn,
        lambdaName
      );
      console.log(`Step output is ${JSON.stringify(testVersionOutput)}`);
    });

    afterAll(async () => {
      const updateConfig = { handler: 'index.handler' };
      const lambdaName = 'VersionUpTest';
      const lambdaConfigFileName = './lambdas.yml';
      console.log(`Updating configuration with ${updateConfig}`);
      updateLambdaConfiguration(lambdaConfigFileName, lambdaName, updateConfig);
      await redeploy(config);
    });

    xit('the workflow executes successfully', () => {
      expect(workflowStatus).toEqual('SUCCEEDED');
    });

    xit('uses the original software version', () => {
      expect(testVersionOutput.payload).toEqual({ output: 'Current Version' });
    });
  });
});
