type ApiLimit = {
  name: string;
  max: number;
  remaining: number;
};

interface DevhubResult {
  devhubusername: string;
  available: boolean;
}

interface Result {
  [key: string]: {
    Max: number;
    Remaining: number;
  };
}

export {
  ApiLimit,
  Result
};
