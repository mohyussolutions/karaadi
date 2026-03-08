import { Context, Callback } from "aws-lambda";

export interface AWSConfig {
  region: string;
  credentials: AWSCredentials;
  maxAttempts?: number;
  retryMode?: "standard" | "adaptive" | "legacy";
}

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface AWSEnvironmentConfig {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN?: string;
}

export interface MetricData {
  MetricName: string;
  Value: number;
  Unit: "Count" | "Bytes" | "Seconds" | "Percent" | "Milliseconds";
  Timestamp: Date;
  Dimensions?: MetricDimension[];
}

export interface MetricDimension {
  Name: string;
  Value: string;
}

export interface S3Config {
  bucketName: string;
  cloudFrontDomain: string;
  corsRules: S3CORSRule[];
  lifecycleRules?: S3LifecycleRule[];
}

export interface S3CORSRule {
  AllowedOrigins: string[];
  AllowedMethods: ("GET" | "PUT" | "POST" | "DELETE" | "HEAD")[];
  AllowedHeaders?: string[];
  ExposeHeaders?: string[];
  MaxAgeSeconds?: number;
}

export interface S3LifecycleRule {
  Id?: string;
  Status: "Enabled" | "Disabled";
  Prefix?: string;
  Expiration?: {
    Days?: number;
    ExpiredObjectDeleteMarker?: boolean;
  };
  Transitions?: {
    Days?: number;
    StorageClass: "STANDARD_IA" | "ONEZONE_IA" | "GLACIER" | "DEEP_ARCHIVE";
  }[];
}

export interface PresignedUrlRequest {
  userId: string;
  contentType: string;
  fileSize?: number;
  metadata?: Record<string, string>;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
  cloudFrontUrl: string;
  expiresIn: number;
  uploadInstructions: {
    method: string;
    headers: Record<string, string>;
  };
}

export interface S3UploadMetadata {
  userId: string;
  uploadedAt: string;
  source?: string;
  optimized?: string;
  [key: string]: string | undefined;
}

export interface S3ObjectInfo {
  key: string;
  bucket: string;
  size: number;
  lastModified: Date;
  etag: string;
  metadata?: S3UploadMetadata;
}

export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
  region: string;
}

export interface CognitoUserAttributes {
  sub: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  picture?: string;
  updated_at?: string;
  "custom:profile_image_updated"?: string;
  "custom:image_optimized"?: string;
  [key: string]: any;
}

export interface CognitoUser {
  id: string;
  username: string;
  attributes: CognitoUserAttributes;
}

export interface UpdateUserAttributesRequest {
  userId: string;
  attributes: Partial<CognitoUserAttributes>;
}

export interface UpdatePictureResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
}

export interface CognitoTokenPayload {
  sub: string;
  email_verified?: boolean;
  iss: string;
  "cognito:username": string;
  origin_jti?: string;
  aud?: string;
  event_id?: string;
  token_use: "access" | "id" | "refresh";
  auth_time?: number;
  exp: number;
  iat: number;
  jti?: string;
  email?: string;
}

export interface LambdaConfig {
  functionName: string;
  handler: string;
  runtime: "nodejs18.x" | "nodejs20.x";
  memorySize: number;
  timeout: number;
  environment: Record<string, string>;
  role: string;
}

export interface ImageProcessorEvent {
  Records: ImageProcessorRecord[];
}

export interface ImageProcessorRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      sequencer: string;
    };
  };
}

export interface ImageProcessingResult {
  statusCode: number;
  body: string;
  processedRecords: number;
  optimizedKeys?: string[];
  errors?: ProcessingError[];
}

export interface ProcessingError {
  key: string;
  error: string;
  timestamp: string;
}

export type LambdaHandler = (
  event: ImageProcessorEvent,
  context: Context,
  callback: Callback,
) => Promise<ImageProcessingResult>;

export interface OptimizedImageMetadata {
  originalKey: string;
  optimizedKey: string;
  userId: string;
  optimizedAt: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

export interface CloudWatchConfig {
  namespace: string;
  metricInterval: number;
  retentionDays: number;
}

export interface CloudWatchMetrics {
  uploadCount: number;
  uploadSize: number;
  processingTime: number;
  errorCount: number;
  optimizationRatio: number;
  cacheHitRate: number;
}

export interface MetricDataPoint {
  MetricName: keyof CloudWatchMetrics;
  Value: number;
  Unit: "Count" | "Bytes" | "Seconds" | "Percent";
  Timestamp: Date;
  Dimensions?: {
    Name: string;
    Value: string;
  }[];
}

export interface CloudWatchAlarm {
  AlarmName: string;
  AlarmDescription: string;
  MetricName: string;
  Namespace: string;
  Statistic: "SampleCount" | "Average" | "Sum" | "Minimum" | "Maximum";
  Period: number;
  EvaluationPeriods: number;
  Threshold: number;
  ComparisonOperator: string;
  AlarmActions: string[];
}

export interface UploadMetric {
  userId: string;
  fileSize: number;
  status: "success" | "failure";
  processingTimeMs: number;
  timestamp: Date;
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}
