import { EOL } from 'os';
import { flags, FlagsConfig, SfdxCommand } from '@salesforce/command';
import { Aliases, Config, Lifecycle, Messages, Org, ScratchOrgRequest, SfdxError } from '@salesforce/core';
import { Duration } from '@salesforce/kit';
import { ApiLimit, DevhubResult, Result } from "../../../../common/typeDefinitions";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@steampunk/sfdx-steampunk-org', 'create');

export default class Create extends SfdxCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(EOL);
  public static readonly requiresProject = false;
  public static readonly supportsDevhubUsername = false;
  public static readonly supportsUsername = false;

  public static readonly flagsConfig: FlagsConfig = {
    devhubusernames: flags.array({
      char: 'p',
      description: messages.getMessage('flags.devhubUsernames'),
      required: true
    }),
    definitionfile: flags.filepath({
      char: 'f',
      description: messages.getMessage('flags.definitionFile'),
      required: true
    }),
    nonamespace: flags.boolean({
      char: 'n',
      description: messages.getMessage('flags.noNamespace'),
    }),
    noancestors: flags.boolean({
      char: 'c',
      description: messages.getMessage('flags.noAncestors'),
    }),
    setdefaultusername: flags.boolean({
      char: 's',
      description: messages.getMessage('flags.setDefaultUsername'),
    }),
    setalias: flags.string({
      char: 'a',
      description: messages.getMessage('flags.setAlias'),
    }),
    wait: flags.minutes({
      char: 'w',
      description: messages.getMessage('flags.wait'),
      min: 6,
      default: Duration.minutes(6),
    }),
    durationdays: flags.integer({
      char: 'd',
      description: messages.getMessage('flags.durationDays'),
      min: 1,
      max: 30,
    }),
    retry: flags.number({
      hidden: true,
      default: 0,
      max: 10,
      description: messages.getMessage('flags.retry'),
    }),
  };

  private async determineDevhub(devhubusernames: string[]): Promise<any> {
    try {
      const results = await Promise.all(
        devhubusernames.map(async devhubusername => {
          const available = await this.hasAvailableScratchOrg(devhubusername);
          return { devhubusername: devhubusername, available: available} as DevhubResult;
        })
      );

      const availableDevhub = results.find(result => result.available);

      return availableDevhub?.devhubusername;
    } catch (err) {
      throw new SfdxError(err.message);
    }
  }

  private async hasAvailableScratchOrg(devhubusername: string): Promise<any> {
    const limits = await this.getApiLimits(devhubusername);

    const { remaining: activeRemaining } = limits.find(limit => limit.name === 'ActiveScratchOrgs');
    const { remaining: dailyRemaining } = limits.find(limit => limit.name === 'DailyScratchOrgs');

    return activeRemaining > 0 && dailyRemaining > 0;
  }

  private async getApiLimits(devhubusername: string): Promise<ApiLimit[]> {
    const localOrg = await Org.create({
      aliasOrUsername: devhubusername
    });
    const conn = localOrg.getConnection();
    const geturl = `${conn.instanceUrl}/services/data/v${conn.version}/limits`;
    const result = await conn.request<Result>(geturl);
    const limits: ApiLimit[] = [];

    Object.keys(result).map((limitName) => {
      limits.push({
        name: limitName,
        max: result[limitName].Max,
        remaining: result[limitName].Remaining,
      });
    });

    return limits;
  }

  private async setAliasAndDefaultUsername(username: string): Promise<void> {
    const aliases = await Aliases.create(Aliases.getDefaultOptions());
    if (this.flags.setalias) {
      await aliases.updateValue(this.flags.setalias, username);
      this.logger.debug('Set Alias: %s result: %s', this.flags.setalias);
    }
    if (this.flags.setdefaultusername) {
      let config: Config;
      try {
        config = await Config.create({ isGlobal: false });
      } catch {
        config = await Config.create({ isGlobal: true });
      }
      const value = aliases.getKeysByValue(username)[0] || username;
      const result = config.set(Config.DEFAULT_USERNAME, value);
      await config.write();
      this.logger.debug('Set defaultUsername: %s result: %s', this.flags.setdefaultusername, result);
    }
  }

  public async run(): Promise<any> {
    const args = [];

    // DEFINITIONFILE
    if (this.flags.definitionfile) {
      args.push('--definitionfile');
      args.push(`${this.flags.definitionfile}`);
    }

    // NONAMESPACE
    if (this.flags.nonamespace) {
      args.push('--nonamespace');
    }

    // NOANCESTORS
    if (this.flags.noancestors) {
      args.push('--noancestors');
    }

    // SETDEFAULTUSERNAME
    if (this.flags.setdefaultusername) {
      args.push('--setdefaultusername');
    }

    // SETALIAS
    if (this.flags.setalias) {
      args.push('--setalias');
      args.push(`${this.flags.setalias}`);
    }

    // WAIT
    if (this.flags.wait) {
      args.push('--wait');
      args.push(`${this.flags.wait}`);
    }

    // DURATIONDAYS
    if (this.flags.durationdays) {
      args.push('--durationdays');
      args.push(`${this.flags.durationdays}`);
    }

    // RETRY
    if (this.flags.retry) {
      args.push('--retry');
      args.push(`${this.flags.retry}`);
    }

    const availableDevhub = await this.determineDevhub(this.flags.devhubusernames);

    if (!availableDevhub) {
      throw new SfdxError(messages.getMessage('noAvailableDevhubs'));
    }

    this.ux.log(`Using devhub: ${availableDevhub}`);

    const localOrg = await Org.create({
      aliasOrUsername: availableDevhub
    });

    const createCommandOptions: ScratchOrgRequest = {
      definitionfile: this.flags.definitionfile as string,
      nonamespace: this.flags.nonamespace as boolean,
      noancestors: this.flags.noancestors as boolean,
      wait: this.flags.wait as Duration,
      durationDays: this.flags.durationdays as number,
      retry: this.flags.retry as number,
      apiversion: this.flags.apiversion as string
    };

    const { username, scratchOrgInfo, authFields, warnings } = await localOrg.scratchOrgCreate(createCommandOptions);

    await Lifecycle.getInstance().emit('scratchOrgInfo', scratchOrgInfo);

    await this.setAliasAndDefaultUsername(username);

    this.ux.log(messages.getMessage('scratchOrgCreateSuccess', [authFields.orgId, username]));

    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        this.ux.warn(warning);
      });
    }

    return {
      username,
      scratchOrgInfo,
      authFields,
      warnings,
      orgId: authFields.orgId,
    };
  }
}
