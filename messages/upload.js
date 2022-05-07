module.exports = {
  commandDescription: `Upload multiple files based on a csv`,
  filepathFlagDescription: `Path to csv file`,
  errorNoOrgResults: `No results found for the org '%s'.`,
  commandExamples: `
  $ sfdx punk:data:files:upload -f ~/FilesToUpload.csv

  You will need to format a csv with the following headers.

  Required:
    - PathOnClient
    - Title

  Optional:
    - FirstPublishLocationId`
};
