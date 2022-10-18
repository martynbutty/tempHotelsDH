import * as cdk from 'aws-cdk-lib';
import { aws_certificatemanager, Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { HotelsDataAcquisitionStackProps } from './hotels_data_acquisition_stack_props';

export class HotelsDataAcquisitionStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: HotelsDataAcquisitionStackProps) {
        super(scope, id, props);

        const supplierRoomTypeMessageQueue = new sqs.Queue(this, 'SupplierRoomTypeAcquisitionMessageQueue', {
            queueName: 'supplierRoomTypeAcquisitionMessageQueue'
        });

        const domainCert = aws_certificatemanager.Certificate.fromCertificateArn(this, 'DomainCert', props.certificateArn);

        const api = new apigateway.RestApi(this, 'SupplierRoomTypeAcquisitionEndpoint', {
            deployOptions: {
                stageName: 'v1',
                tracingEnabled: true,
            },
            domainName: {
                domainName: `${props.subdomain}.${props.domain}`,
                certificate: domainCert
            },
        });

        const zone = route53.HostedZone.fromLookup(this, 'HotelsHostedZone', {
            domainName: props.domain,
            privateZone : true
        });

        const aRecord = new route53.ARecord(this, 'HotelsDataAcquisitionAlias', {
            zone: zone,
            recordName: props.subdomain,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
        });


        const credentialsRole = new iam.Role(this, 'HotelsDataAcquisitionRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        });

        credentialsRole.attachInlinePolicy(
            new iam.Policy(this, 'SendMessagePolicy', {
                statements: [
                    new iam.PolicyStatement({
                        actions: ['sqs:SendMessage'],
                        effect: iam.Effect.ALLOW,
                        resources: [supplierRoomTypeMessageQueue.queueArn],
                    }),
                ],
            })
        );

        const integration = api.root.addResource('supplierRoomTypes');

        integration.addMethod(
            'POST',
            new apigateway.AwsIntegration({
                service: 'sqs',
                path: `${Stack.of(this).account}/${supplierRoomTypeMessageQueue.queueName}`,
                integrationHttpMethod: 'POST',
                options: {
                    credentialsRole,
                    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
                    requestParameters: {
                        'integration.request.header.Content-Type': `'application/x-www-form-urlencoded'`,
                    },
                    requestTemplates: {
                        'application/json': `Action=SendMessage&MessageBody=$util.urlEncode("$input.body")`,
                    },
                    integrationResponses: [
                        {
                            statusCode: '200',
                            responseTemplates: {
                                'application/json': `{"done": true}`,
                            },
                        },
                    ],
                },
            }),
            { methodResponses: [{ statusCode: '200' }] }
        );
    }
}
