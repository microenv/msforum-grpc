import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { EnvConfig } from './config.interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
	private readonly envConfig: EnvConfig;

	constructor(filePath: string) {
		this.envConfig = dotenv.parse(fs.readFileSync(filePath));
	}

	get(key: string): string {
		if (key in process.env) {
			return process.env[key];
		}

		return this.envConfig[key];
	}
}
