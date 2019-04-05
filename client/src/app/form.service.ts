import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }


  static tableHtml(data_json): string {

    let html;

    for (let i = 0; i < data_json.length; i++) {

      html += '<option>';
      html += data_json[i]['username'];
      html += '</option>';

    }
    return html;
  }

}
