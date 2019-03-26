import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  /*
*  Outputs table HTML
* param: data_json The table data
* param: name_columns The name of the columns to include in the
* param: editCol - Add an edit column (true/false)
* param: delCol - Add a delete column (true/false)
*/

  //static tableHtml(data_json, name_columns, editColumn, delColumn) {
  static tableHtml(data_json, name_columns, editColumn, delColumn): string {

    let keys = [];
    if (name_columns === undefined)
      name_columns = {};
    else
      keys = Object.keys(name_columns);

    if (data_json === undefined)
      return "No Data";
    //data_json = {}; //json data object

    let html = '<table class="table table-hover alt">\n';

    //display headings
    html += '<thead>\n';
    html += '<tr>';

    for (let val of keys) {
      html += '<th scope="col">';
      html += name_columns[val];
      html += '</th>';
    }

    if (editColumn)
      html += '<th scope="col">Edit</th>';

    if (delColumn)
      html += '<th scope="col">Del</th>';

    html += '</th>';
    html += '</thead>';
    html += '<tbody>';

    //display data
    for (let i = 0; i < data_json.length; i++) {
      html += '<tr>';

      //add items in each object
      for (let key of keys) {
        html += '<td>';
        html += data_json[i][key];
        html += '</td>';
      }

      //TODO replace auth with the correct api, may need to pass in as param
      if (editColumn)
        html += '<td><a href="/api/auth/edit/'+ data_json[i]['_id'] + '" ><span style="color:#092;">\n' +
          '    <i class="fa fa-edit fa-lg fa-fw"></i></span></a></td>';

      if (delColumn)
        html += '<td><a class="btn-delete" href="' + data_json[i]['_id'] + '"><span\n' +
          '    style="color:#f00;">\n' +
          '    <i class="fa fa-trash-alt fa-fw"></i></span></a></td>';

      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    return html;
  }

}
