function encodeRFC3986URI(str) {
  return encodeURIComponent(str)
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]")
    .replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
}

function iabulkuptable(jsonfile,loadfrom) {
    fetch(jsonfile).then((resp) => resp.json())
    .then((content) => {
        total = content.length;
        nodocument = [];
        notpublic = [];
        notenglish = [];
        var list = '';
        
        function maxkeycolumn(key) {
            array = [];
            for (var i=0; i < total; i++) {
                if (content[i].hasOwnProperty(key)) {
                    array.push(content[i][key].length);
                }
            }
            return Math.max(...array);
        }

        const maxcolumnsubjects = maxkeycolumn("subjects");
        const maxcolumncreators = maxkeycolumn("creators");
        const maxcolumndivisions = maxkeycolumn("divisions");
        const maxcolumncopyright_holders = maxkeycolumn("copyright_holders");
        list += "identifier,file,description,date,title,publisher,language,mediatype,eprintid";
        for (var f=0; f < maxcolumnsubjects; f++) {
            list += ",subject[" + f + "]";
        }
        for (var g=0; g < maxcolumncreators; g++) {
            list += ",creator[" + g + "]";
        }
        for (var h=0; h < maxcolumndivisions; h++) {
            list += ",division[" + h + "]";
        }
        for (var p=0; p < maxcolumncopyright_holders; p++) {
            list += ",copyright_holder[" + p + "]";
        }
        list += ",collection";
        for (var i=0; i < total; i++) {
            if (content[i].hasOwnProperty("documents")) {
                for (var j=0; j < content[i].documents.length; j++) {
                    if (content[i].documents[j].security == "public") {
                        for (var k=0; k < content[i].documents[j].files.length && content[i].documents[j].hasOwnProperty("relation")==false; k++) {
                            let link = '';
                            if (j == 0) {
                                link += "mmu-eprint-" + content[i].eprintid;
                            }
                            link += ',';
                            if (loadfrom == "local") {
                                link += '"' + "D:\\Exam paper\\Exam paper 5\\id\\eprint\\" + content[i].eprintid + "\\" + content[i].documents[j].pos + "\\" + content[i].documents[j].files[k].filename + '"';
                            } else if (loadfrom == "url") {
                                link += '"' + content[i].uri + "/" + content[i].documents[j].pos + "/" + encodeRFC3986URI(content[i].documents[j].files[k].filename) + '"';
                            }
                            if (j == 0) {
                                link += ',';
                                if (content[i].hasOwnProperty("abstract")) {
                                    link += '"' + content[i].abstract.replaceAll("\r\n", "<br />") + '"';
                                }
                                link += ',';
                                if (content[i].hasOwnProperty("date")) {
                                    link += '"' + content[i].date + '"';
                                }
                                link += ',';
                                if (content[i].hasOwnProperty("title")) {
                                    link += '"' + content[i].title.replaceAll("\r\n", " ") + '"';
                                }
                                link += ',';
                                if (content[i].hasOwnProperty("publisher")) {
                                    link += '"' + content[i].publisher + '"';
                                }
                                link += ',' + "eng";
                                link += ',' + "texts";
                                link += ',' + content[i].eprintid;
                                for (var l=0; l < maxcolumnsubjects; l++) {
                                    link += ",";
                                    if (content[i].hasOwnProperty("subjects")) {
                                        if (l < content[i].subjects.length) {
                                            link += content[i].subjects[l];
                                        }
                                    }
                                }
                                for (var m=0; m < maxcolumncreators; m++) {
                                    link += ",";
                                    if (content[i].hasOwnProperty("creators")) {
                                        if (m < content[i].creators.length) {
                                            link += '"' + content[i].creators[m].name.family + ", " + content[i].creators[m].name.given + '"';
                                        }
                                    }
                                }
                                for (var n=0; n < maxcolumndivisions; n++) {
                                    link += ",";
                                    if (content[i].hasOwnProperty("divisions")) {
                                        if (n < content[i].divisions.length) {
                                            link += content[i].divisions[n];
                                        }
                                    }
                                }
                                for (var o=0; o < maxcolumncopyright_holders; o++) {
                                    link += ",";
                                    if (content[i].hasOwnProperty("copyright_holders")) {
                                        if (o < content[i].copyright_holders.length) {
                                            link += content[i].copyright_holders[o];
                                        }
                                    }
                                }
                                link += ",shdl";
                            }
                            if (content[i].documents[j].hasOwnProperty("language")) {
                                if (content[i].documents[j].language != "en") {
                                    notenglish.push(content[i].eprintid);
                                }
                            } else {
                                notenglish.push(content[i].eprintid);
                            }
                            list += '\n' + link;
                        }
                    } else {
                        notpublic.push(content[i].eprintid);
                    }
                }
            } else {
                nodocument.push(content[i].eprintid);
            }
        }
        console.log(list);
    });
}
