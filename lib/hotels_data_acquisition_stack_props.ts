import * as cdk from 'aws-cdk-lib';

export interface HotelsDataAcquisitionStackProps extends cdk.StackProps {
    readonly certificateArn: string;
    readonly domain: string;
    readonly subdomain: string;
}
