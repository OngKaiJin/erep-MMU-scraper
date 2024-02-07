function encodeRFC3986URI(str) {
  return encodeURIComponent(str)
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]")
    .replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
}

function getlinks(jsonfile) {
    fetch(jsonfile, {cache: "no-store"}).then((resp) => resp.json())
    .then((content) => {
        total = content.length;
        nodocument = [];
        notpublic = [];
        for (var i=0; i < total; i++) {
            if (content[i].hasOwnProperty("documents")) {
                for (var j=0; j < content[i].documents.length; j++) {
                    if (content[i].documents[j].security == "public") {
                        for (var k=0; k < content[i].documents[j].files.length && content[i].documents[j].hasOwnProperty("relation")==false; k++) {
                            console.log('http://erep.mmu.edu.my/id/eprint/' + content[i].eprintid + "/" + content[i].documents[j].pos + "/" + encodeRFC3986URI(content[i].documents[j].files[k].filename));
                        }
                    } else {
                        notpublic.push(content[i].eprintid);
                    }
                }
            } else {
                nodocument.push(content[i].eprintid);
            }
        }
    });
}
