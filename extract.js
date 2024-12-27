import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { promises as fs } from "fs";

const dict1 = new Map(Object.entries(JSON.parse(await fs.readFile("./dict1/german_english.json"))));
const dict2 = new Map;
{
    // for(let line of (await fs.readFile("./dict2/dict.txt")).toString().split("\n")){
    //     let [word,def] = line.trim().split(/[\t]+/);
    //     word = word.split(/\s+/)[0];
    //     if(dict2.has(word))continue;
    //     dict2.set(word,def);
    // }
}

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

const capitalize = function(w){
    return w[0].toUpperCase() + w.slice(1);
}

for(let line of lines){
    const r = line.match(/[a-zA-ZÄÜÖẞßäöü]+/g);
    for(let word of r){
        word = word.toLowerCase();
        if(blacklist.has(word))continue;
        if(!words.has(word)){
            words.set(word,{
                count: 0,
                context: []
            });
        }
        const wo = words.get(word);
        wo.count++;
        wo.context.push(line);
    }
}
const res = [...words].sort((a,b)=>b[1]-a[1]).map(([w,f])=>{
    const capw = capitalize(w);
    if(dict1.has(w))return [w,dict1.get(w),f];
    if(dict1.has(capw))return [capw,dict1.get(capw),f];
    if(dict2.has(w))return [w,dict2.get(w),f];
    if(dict2.has(capw))return [capw,dict2.get(capw),f];
    return [w,null,f];
});//.filter(v=>v[1] === null);
//console.log(JSON.stringify(res,null,4));
await fs.writeFile("ep1.json",JSON.stringify(res,null,4));




// for(let w of res){
//     console.log(w);
// }

//console.log(res);





