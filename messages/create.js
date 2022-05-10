module.exports = {
  description: `Create a scratch org provided a pool of devhubs`,
  examples: [
    `$ sfdx punk:org:pool:create -v "MyDevHub1, MyDevHub2, MyDevHub3"`
  ],
  flags: {
    "devhubUsernames": "list of devhub usernames to pool from",
    "setDefaultUsername": "set the created org as the default username",
    "setAlias": "alias for the created org",
    "definitionFile": "path to an org definition file",
    "definitionJson": "org definition in JSON format",
    "noNamespace": "create the scratch org with no namespace",
    "noAncestors": "do not include second-generation package ancestors in the scratch org",
    "env": "environment where the scratch org is created: %s",
    "durationDays": "duration of the scratch org (in days) (default:7, min:1, max:30)",
    "retry": "Number of scratch org auth retries after scratch org is successfully signed up.",
    "wait": "the streaming client socket timeout (in minutes)"
  }
};
