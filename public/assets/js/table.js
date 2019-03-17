/*
*  Outputs table HTML
* param: data_json The table data
* param: name_columns The name of the columns to include in the
* param: editCol - Add an edit column (true/false)
* param: delCol - Add a delete column (true/false)
*/

function tableHtml(data_json, name_columns, editColumn, delColumn) {

    if (name_columns === undefined)
        name_columns = [];

    if (data_json === undefined)
        return "No Data";
        //data_json = {}; //json data object

//remove Del if user is not admin

    let html = '<table class="table table-hover alt">\n';

    //display headings
    html += '<thead>\n';
    html += '<tr>';

    for (let i = 0; i < name_columns.length; i++) {
        html += '<th scope="col">';
        html += name_columns[i];
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
        for (let j= 0; j < name_columns.length; j++) {
            html += '<td>';
            let key = name_columns[j];
            html += data_json[i][key];
            html += '</td>';
        }

        //TODO populate the href attribute in edit and delete
        if (editColumn)
            html += '<td><a href="#"><span style="color:#092;">\n' +
                '    <i class="fa fa-edit fa-lg fa-fw"></i></span></a></td>';

        if (delColumn)
            html += '<td><a href="#" onclick="return confirm(\'Confirm Delete?\')"><span\n' +
                '    style="color:#f00;">\n' +
                '    <i class="fa fa-trash-alt fa-fw"></i></span></a></td>';

        html += name_columns[i];
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    return html;
}