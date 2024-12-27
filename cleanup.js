import {promises as fs} from "fs";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
let lines;
// clean up the lines
{
    const extractTextNodes = function(obj, res=[]){
        if(typeof obj === "string"){
            res.push(obj);
        }else if(obj instanceof Array){
            for(let val of obj){
                extractTextNodes(val, res);
            }
        }else{
            for(let key in obj){
                extractTextNodes(obj[key], res);
            }
        }
        return res;
    };
    
    
    
    
    
    const lineCache = new Map;
    const xml = (await fs.readFile("./s.xml")).toString();
    const jobj = (new XMLParser()).parse(xml);
    lines = extractTextNodes(jobj.tt.body.div.p).filter(v=>v!=="").map((l,i)=>{
        let lobj = {
            i: i,
            raw: l,
            formatted: l
        };
        lineCache.set(l.replace(/\s/g,""),lobj);
        return lobj;
    });
    const words = JSON.parse(await fs.readFile(process.argv[2]));
    for(let [de,en,{context:lines}] of words){
        for(let line of lines){
            let r;
            if(r = lineCache.get(line.replace(/\s/g,""))){
                r.formatted = line;
            }else{
                console.log(`unregistered line: ${line}`);
            }
        }
    }
    lines = lines.map(v=>v.formatted);
    lines = lines.map(l=>l.replace(/[\.\,][^\s]/g,([a,b])=>a+" "+b));
}


const capitalize = function(w){
    return w[0].toUpperCase() + w.slice(1);
}

const lineSet = new Set(lines);

let dict = new Map;
for(let [de,en] of JSON.parse(await fs.readFile(process.argv[2]))){
    if(dict.has(en))continue;
    dict.set(de,en);
}
console.log(dict);

let blacklist = new Set;
let wordObjects = new Map;
let wordList = [];

for(let line of lines){
    const r = line.match(/[a-zA-ZÄÜÖẞßäöü]+/g);
    for(let word of r){
        word = word.toLowerCase();
        if(word === "hinzfügen")console.log("Hinzfugen!!!");
        if(!dict.has(word)){
            if(dict.has(capitalize(word))){
                word = capitalize(word);
            }else{
                //console.log(word,line);
                blacklist.add(word);
                continue;
            }
        }
        if(!dict.has(word)){
        }
        const en = dict.get(word);
        if(!wordObjects.has(word)){
            let wo = {
                count: 0,
                context: []
            };
            wordList.push([word,en,wo]);
            wordObjects.set(word,wo);
        }
        const wo = wordObjects.get(word);
        wo.count++;
        wo.context.push(line);
    }
}
for(let [de,en] of dict){
    if(!wordObjects.has(de)){
        console.log(de,en);
    }
}
console.log(blacklist);
await fs.writeFile("ep1-edited-clean.json",JSON.stringify(wordList,null,4));
await fs.writeFile("lines-clean.txt",lines.join("\n"));








