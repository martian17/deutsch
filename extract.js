import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { promises as fs } from "fs";

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


const xml = (await fs.readFile("./s.xml")).toString();
const jobj = (new XMLParser()).parse(xml);
const lines = extractTextNodes(jobj.tt.body.div.p).filter(v=>v!=="");
const words = new Map;
const blacklist = new Set([
  'ist',   'das',  'wir',  
  'es',    'sie',  'ich',  
  'die',   'der',  'und',  
  'nicht', 'was',  'ein',  
  'zu',    'sind', 'aber', 
  'in',    'du',   'eine',
]);

for(let line of lines){
    const r = line.match(/[a-zA-ZÄÜÖẞßäöü]+/g);
    for(let word of r){
        word = word.toLowerCase();
        if(blacklist.has(word))continue;
        if(!words.has(word)){
            words.set(word,1);
        }else{
            words.set(word,words.get(word)+1);
        }
    }
}
console.log([...words].sort((a,b)=>b[1]-a[1]));

//console.log(res);





