import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { HotelsDataAcquisitionStack } from '../lib/hotels_data_acquisition-stack';

describe('HotelsDataAcquisitionStack', () => {
    const app = new cdk.App();

    const stack = new HotelsDataAcquisitionStack(app, 'HotelsDataAcquisitionStackTest', {
    env: {
        account: '123456789012',
        region: 'us-east-1'
    },
    tags: {
        product: 'HotelsDataAcquisitionStackTest',
        team: 'hotelDataHubTest',
        environment: 'test',
        pii: 'none'
    },
    certificateArn: 'testCertificate',
    domain: 'testing-domain',
    subdomain: 'testing-subdomain',
    });

    const template = Template.fromStack(stack);

    test('SQS Queue Created', () => {
        template.hasResourceProperties('AWS::SQS::Queue', {
        QueueName: 'supplierRoomTypeAcquisitionMessageQueue'
        });
    });

    test('Route 53 Created', () => {
        template.hasResourceProperties('AWS::Route53::RecordSet', {
            Type: 'A',
            Name: 'testing-subdomain.testing-domain.'
        });
    });

    test('Api Gateway Created', () => {
        template.hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'SupplierRoomTypeAcquisitionEndpoint'
        });
    });

    test('Resource Added', () => {
        template.hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'supplierRoomTypes'
        });
    });

    test('Method Added', () => {
        template.hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'POST',
            Integration: {
                PassthroughBehavior: 'NEVER',
                IntegrationHttpMethod: 'POST'
            }
        });
    });

    test('Api Gateway domain name created', () => {
        template.hasResourceProperties('AWS::ApiGateway::DomainName', {
            DomainName: 'testing-subdomain.testing-domain'
        });
    });

    test('Api Gateway stage name created', () => {
        template.hasResourceProperties('AWS::ApiGateway::Stage', {
            StageName: 'v1'
        });
    });
});