'use strict';

const data = 
"Chaeyeon has participated was apart of which reality tv show? [K-pop Star, The Unit, Mix Nine, Idol School, Dancing 9] A7E0E1?\
Minju is affectionately associated which which animal? [Frog, Giraffe, Duck, Puppy, Cat] FFFFFF? \
Chaewon's ability is peeling tangerines how many can she peel in 30 seconds? [3, 1, 5, 2, 8] CEE5D5? \
Hitomi hosts a variety tv show touring Tochigi Prefecture, which car brand sponsors this? [Toyota, Honda, Mazda, Nissan, Suzuki] F1C3AA? \
Hyewon won hearts by being a mother figure to which AKB member? [Minami Sato, Nanami Asai, Yuka Asai, Erii Chiba, Yuka Asai] DB706C? \
Eunbi what stage name did she use during a previous group debut? [Kazoo, Celeb, Orangee, Baguette, Irene] BBB0DC? \
Nako is the shortest member in the group what is her height? [149.9cm, 150cm, 155.2cm, 148cm, 151cm] B7D3E9? \
Yujin participated in a singing tv show called King of The Masked Singer, what character was she? [Icicle, Snowflake, Snowman, Igloo, Cloud] 567ACE? \
Yena's older brother was part of kpop boy band, which one? [Speed, EXO, BTS, Topp Dogg, AlphaBat] FCF695? \
Yuri was previously on another audition reality tv show which one? [Idol School, Korea's Got Talent, Sixteen, K-pop Star, Superstar K] F3AA51? \
Sakura loves this particular pickled food and terrorizes korean members with, what is it? [Plum, Beet, Eggplant, Ginger, Radish] F1D2E7? \
Wonyoung along with Nako and Chaewon love which flavor of Ice cream? [Mint Choco, Strawberry, Vanilla, Chocolate, Green Tea] d9598c?";

let questionIndex = 0;
let score = 0;

//const listStyle = "answerItem";
const listStyle = "question";
const answerStyle = "answer";
const questionClassID = ".question-list";

//{question: "Test", answers: ["The Unit", "Mix Nine", "K-pop Star", "Idol School", "Dancing 9"]}
const DataBase = [];

function ResetQuiz()
{
    questionIndex = score = 0;
}

function GenerateQuestionString(index)
{
    console.log(`Called GenerateQuestionString`);
    const q = DataBase[index];
    let questionString = [];
    let answerIndex = 0;

    // set color
    //$('.membercolor').css({'background-color':`#${q.color}`});
    
    //$('.membercolor').css({"background-color":"red"});

    q.answers.forEach(item => questionString.push(`<li class='${listStyle} ${answerStyle} ${answerIndex++ === 0 ? 'solution' : ''}'>${item}</li>`));
    shuffleArray(questionString);

    questionString.unshift(`<li class='${listStyle} membercolor'>${q.question}?</li>`);

    return questionString.join("");
}

function GenerateTable()
{
    console.log(`Called GenerateTable`);

    let questionList = data.split(new RegExp(['\\\?', '\\\] ', '\\\['].join('|'), 'g'));
    questionList = questionList.filter(item => item != " " && item != "");

    for(let i=0; i<questionList.length; i+=3)
        DataBase.push({question: questionList[i], answers: questionList[i+1].split(", "), color: questionList[i+2]});

    //console.log(questionList);
    console.log(DataBase);
}

function HandleQuiz()
{
    console.log(`Called HandleQuiz`);
    HandleAnswerSelect();
    GenerateTable();
    RenderQuestion(questionIndex);
    CalculateScore();
}

function RenderQuestion(index)
{
    let questionStr = GenerateQuestionString(index);
    // display the current question
    //console.log(questionStr);
    $(questionClassID).empty().append(questionStr);

    // set color question color
    //$('.membercolor').css('background-color', `#${DataBase[index].color}`);
    $('.membercolor').css('background-color', `rgba( ${hex2rgb(DataBase[index].color)} , 0.5)`);
}

function hex2rgb(hex)
{
    let lint = parseInt(hex,16);
    return `${(lint >> 16) & 255},${(lint >> 8) & 255},${lint & 255}`;
}

function DisplayFinalResults()
{

}

function HandleAnswerSelect()
{
    console.log(`Called HandleAnswerSelect`);
    $('.question-list').on('click', 'li', function(event) {
        event.stopPropagation();

        if($(this).hasClass("selected"))
            HandleAnswerSubmit(this);
        else if($(this).hasClass("answer"))
        {
            $('li').removeClass("selected");
            $(this).addClass("selected");
        }
    });
}

function HandleAnswerSubmit(eventTarget)
{
    // check answer
    if($(eventTarget).hasClass("solution"))
        ++score;

        // if completed display results else transition to next question
    if(++questionIndex > DataBase.length)
        DisplayResults();
    else        
        RenderQuestion(questionIndex);
                
    CalculateScore();
}

function DisplayResults()
{
    // display final splash summary
}

function CalculateScore()
{
    console.log(`Called CalculateScore`);
    //console.log(`Score: ${score} / ${DataBase.length}`);
    // update total score and question number
    $('.score').html(`Score: ${score}<br>Question: ${questionIndex+1}/${DataBase.length}`);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?page=1&tab=votes#tab-top
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

$(HandleQuiz);