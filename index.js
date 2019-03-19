'use strict';

const data = 
"Chaeyeon has participated was apart of which reality tv show? [K-pop Star, The Unit, Mix Nine, Idol School, Dancing 9] \
Minju is affectionately associated which which animal? [Frog, Giraffe, Duck, Puppy, Cat] \
Chaewon's ability is peeling tangerines how many can she peel in 30 seconds? [3, 1, 5, 2, 8] \
Hitomi hosts a variety tv show touring Tochigi Prefecture, which car brand sponsors this? [Toyota, Honda, Mazda, Nissan, Suzuki] \
Hyewon won hearts by being a mother figure to which AKB member? [Minami Sato, Nanami Asai, Yuka Asai, Erii Chiba, Yuka Asai] \
Eunbi what stage name did she use during a previous group debut? [Kazoo, Celeb, Orangee, Baguette, Irene] \
Nako is the shortest member in the group what is her height? [149.9cm, 150cm, 155.2cm, 148cm, 151cm] \
Yujin participated in a singing tv show called King of The Masked Singer, what character was she? [Icicle, Snowflake, Snowman, Igloo, Cloud] \
Yena's older brother was part of kpop boy band, which one? [Speed, EXO, BTS, Topp Dogg, AlphaBat] \
Yuri was previously on another audition reality tv show which one? [Idol School, Korea's Got Talent, Sixteen, K-pop Star, Superstar K] \
Sakura loves this particular pickled food and terrorizes korean members with, what is it? [Plum, Beet, Eggplant, Ginger, Radish] \
Wonyoung along with Nako and Chaewon love which flavor of Ice cream? [Mint Choco, Strawberry, Vanilla, Chocolate, Green Tea]";

let questionIndex = 0;
const listStyle = "answerItem";

//{question: "Test", answers: ["The Unit", "Mix Nine", "K-pop Star", "Idol School", "Dancing 9"]}
const DataBase = [];

function GenerateQuestionString(index, styling)
{
    const q = DataBase[index];
    let questionString = [];
    let answerIndex = 0;

    q.answers.forEach(item => questionString.push(`<li class='${styling} ${answerIndex++ === 0 ? 'solution' : ''}'>${item}</li>`));
    shuffleArray(questionString);

    questionString.unshift(`<li class='${styling}'>${q.question}</li>`);

    return questionString.join("");
}

function GenerateTable()
{
    console.log(`Called GenerateTable`);

    let questionList = data.split(new RegExp(['\\\?', '\\\]', '\\\['].join('|'), 'g'));
    questionList = questionList.filter(item => item != " " && item != "");

    for(let i=0; i<questionList.length; i+=2)
        DataBase.push({question: questionList[i], answers: questionList[i+1].split(",")});

    //console.log(questionList);
    console.log(DataBase);
}

function HandleQuiz()
{
    console.log(`Called HandleQuiz`);
    GenerateTable();
    RenderQuestion(questionIndex);
}

function RenderQuestion(index)
{
    let questionStr = GenerateQuestionString(index, listStyle);
    // display the current question
    //console.log(questionStr);
    $('ul').empty().append(questionStr);
}

function HandleAnswerSelect()
{
    // update style and retrive answer
    HandleAnswerSubmit();
}

function HandleAnswerSubmit()
{
    // check answer

    CalculateScore();

    // if completed display results else transition to next question
}

function DisplayResults()
{
    // display final splash summary
}

function CalculateScore()
{
    // update total score and question number
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