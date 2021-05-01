import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfigService {
    private config;

    constructor(private http: HttpClient) {
    }

    public getConfig(key: any) {
        return this.config[key];
    }

    loadAppConfig() {
        return this.http.get('./assets/app-Config.json')
            .toPromise()
            .then(data => {
                console.log(data);
                this.config = data;
            });
    }

}