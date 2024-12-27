import {ELEM,CSS} from "htmlgen";

//const json = await fetch("localhost:8787/api/");

class API{
    async getQuiz(id: string){
        return await (await fetch("http://localhost:8787/api/quize/id")).json();
    }
}

const Api = new API();

class Quiz extends ELEM{
    static createQuiz(elem: HTMLElement){
        const quiz = new Quiz();
        quiz.add("div",{class:"question"});
        quiz.add("div",{class:"options"});
        return quiz;
    }
}


class App{
    constructor(elem: HTMLElement){
        this.elem = elem;
    }
    displayQuiz(){
    }
}

// class App extends ELEM{
//     static createApp(elem: HTMLElement){
//         const app = App.create(elem);
//     }
//     async quiz(id: string){
//         const data = await Api.getQuiz(id);
//         
//     }
//     async showQuizSelect(){
//         const quizes = await Api.getQuizes();
//     }
// }

CSS.init();


App.createApp(document.querySelector("#app") as HTMLElement);



