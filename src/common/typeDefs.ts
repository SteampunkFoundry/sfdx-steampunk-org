interface ContentVersion extends Record {
  Title: string;
  FileExtension: string;
  VersionData: string;
  ContentDocumentId?: string;
}

interface ContentDocument extends Record {
  LatestPublishedVersionId: string;
}

interface ContentVersionCreateRequest {
  FirstPublishLocationId?: string;
  PathOnClient: string;
  Title?: string;
}

interface Record {
  attributes: object;
  Id: string;

  Name?: string;

  ContentDocumentId?: string;

  LiveAgentChatUrl?: string;
  LiveAgentContentUrl?: string;
}

interface CreateResult {
  id: string;
  success: boolean;
  errors: string[];
  name: string;
  message: string;
}

interface QueryResult {
totalSize: number;
done: boolean;
records: Record[];
}

export {
  Record,
  ContentVersion,
  ContentDocument,
  CreateResult,
  ContentVersionCreateRequest,
  QueryResult
};
