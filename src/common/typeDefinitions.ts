interface ApiLimit {
  name: string;
  max: string;
  remaining: number;
}

interface CreateOrgResult {
  orgId: string;
  username: string;
}

export {
  ApiLimit,
  CreateOrgResult
};
