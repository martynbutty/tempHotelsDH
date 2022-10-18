#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HotelsDataAcquisitionStack } from '../lib/hotels_data_acquisition-stack';

function getParams(keyName: string, environment = 'ENV') {
  return app.node.tryGetContext(keyName)[app.node.tryGetContext(environment)];
}

const app = new cdk.App();
new HotelsDataAcquisitionStack(app, 'HotelsDataAcquisitionStack', {
  env: getParams('aws_env_details'),

  tags: {
    product: 'HotelsDataAcquisitionStack',
    team: 'hotelDataHub',
    environment: getParams('stack_details')['environment'],
    pii: 'none'
  },
  certificateArn: getParams('stack_details')['certificate_arn'],
  domain: getParams('stack_details')['domain'],
  subdomain: getParams('stack_details')['subdomain'],
});
