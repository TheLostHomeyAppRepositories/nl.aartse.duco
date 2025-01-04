'use strict';

import Homey from 'homey/lib/Homey';
import https from 'https';

export default class HttpClient {

    homey: Homey
    hostname!: string;

    constructor(homey: Homey) {
        this.homey = homey;

        const onSettingsChange = (field: any) => {
            if ('hostname' === field) {
                this.hostname = this.homey.settings.get('hostname');
            }
        }

        this.homey.settings.on('set', onSettingsChange);
        this.hostname = this.homey.settings.get('hostname');
    }

    get(path: string) : Promise <string> {
        return new Promise((resolve, reject) => {
            if (!this.hostname) {
                return reject(new Error(this.homey.__('error.hostname_not_set')));
            }

            const homey = this.homey;
            const options = {
                method: 'GET',
                hostname: this.hostname,
                port: 443,
                path: path,
                headers: {
                    'Accept': '*/*',
                },
                maxRedirects: 5,
                rejectUnauthorized: false,
                timeout: 9000,
            };

            homey.log(`sending GET request to "https://${options.hostname}${options.path}"`);

            const req = https.request(options, res => {
                homey.log(`http status code: ${res.statusCode}`);

                const data: string[] = [];
                res.on('data', chunk => data.push(chunk));

                res.on('end', () => {
                    homey.log(`response: "${data.join('')}"`);

                    if (res.statusCode !== 200) {
                        return reject(new Error(`Failed to GET url: ${options.path} (status code: ${res.statusCode})`));
                    }

                    return resolve(data.join(''));
                });
            });

            req.setTimeout(options.timeout, function() {
                req.destroy();
            });

            req.on('error', error => {
                homey.error(error);

                if (error.message === 'socket hang up') {
                    return reject(new Error(`Request timed out after ${options.timeout} ms while conneting to ${options.hostname}`));
                }

                return reject(error)
            });

            req.end();
        });
    }

    post(path: string, postData: any) : Promise <string> {
        return new Promise((resolve, reject) => {
            if (!this.hostname) {
                return reject(new Error(this.homey.__('error.hostname_not_set')));
            }

            const homey = this.homey;
            const body = JSON.stringify(postData);
            const options = {
                method: 'POST',
                hostname: this.hostname,
                port: 443,
                path: path,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(body),
                    'Accept': '*/*',
                },
                maxRedirects: 5,
                rejectUnauthorized: false,
                timeout: 9000,
            };

            homey.log(`sending POST request to "https://${options.hostname}${options.path}"`);
            homey.log(`body: "${body}"`);

            const req = https.request(options, res => {
                homey.log(`http status code: ${res.statusCode}`);

                const data: string[] = [];
                res.on('data', chunk => data.push(chunk));

                res.on('end', () => {
                    homey.log(`response: "${data.join('')}"`);

                    if (res.statusCode !== 200) {
                        return reject(new Error(`Failed to POST to url: ${options.path} (status code: ${res.statusCode})`));
                    }

                    return resolve(data.join(''));
                });
            });

            req.setTimeout(options.timeout, function() {
                req.destroy();
            });

            req.on('error', error => {
                homey.error(error);

                if (error.message === 'socket hang up') {
                    return reject(new Error(`Request timed out after ${options.timeout} ms while conneting to ${options.hostname}`));
                }

                return reject(error)
            });
            req.write(body);
            req.end();
        });
    }
}