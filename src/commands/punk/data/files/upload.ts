
import * as csv from 'csv-parser';
import * as fs from 'fs-extra';
import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import { fileToContentVersion } from "../../../../common/fileToContentVersion";
import { ContentVersion } from "../../../../common/typeDefinitions";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file.
// Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('@steampunk/sfdx-steampunk-data', 'upload');

export default class Upload extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `sfdx punk:data:files:upload -f ~/FilesToUpload.csv`,
  ];

  protected static flagsConfig = {
    filepath: flags.filepath({
      char: "f",
      description: messages.getMessage('filepathFlagDescription'),
      required: true,
    }),
  };

  protected static requiresUsername = true;

  private async readFile(filePath: string): Promise<any> {
    let rows = [];

    return new Promise<any>((resolve) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          rows.push(data);
        })
        .on("end", () => {
          resolve(rows);
        });
    });
  }

  public async run(): Promise<any> {
    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    const csvFilePath = this.flags.filepath;

    this.ux.startSpinner("Reading CSV");

    let filesToUpload = await this.readFile(csvFilePath);

    this.ux.stopSpinner();

    this.ux.startSpinner("Loading files");

    const createCsvWriter = require("csv-writer").createObjectCsvWriter;

    const successWriter = createCsvWriter({
      path: "success.csv",
      header: [
        { id: "PathOnClient", title: "PathOnClient" },
        { id: "Title", title: "Title" },
        { id: "FirstPublishLocationId", title: "FirstPublishLocationId" },
        { id: "ContentDocumentId", title: "ContentDocumentId" },
      ],
    });

    const errorWriter = createCsvWriter({
      path: "error.csv",
      header: [
        { id: "PathOnClient", title: "PathOnClient" },
        { id: "Title", title: "Title" },
        { id: "FirstPublishLocationId", title: "FirstPublishLocationId" },
        { id: "Error", title: "Error" }
      ],
    });

    for (let [i, file] of filesToUpload.entries()) {
      let success = [];
      let failure = [];
      this.ux.startSpinner(`Loading file ${i + 1} of ${filesToUpload.length}`);
      try {
        const CV = (await fileToContentVersion(
          conn,
          file.PathOnClient,
          file.Title,
          file.FirstPublishLocationId
        )) as ContentVersion;

        file.ContentDocumentId = CV.ContentDocumentId;
        success.push(file);
        await successWriter.writeRecords(success);
      } catch (error) {
        file.Error = error;
        failure.push(file);
        await errorWriter.writeRecords(failure);
      } finally {
        this.ux.stopSpinner();
      }
    }

    return "Success";
  }
}
