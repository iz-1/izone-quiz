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
//let transitionState = false;
let transitionTimer = null;

//const listStyle = "answerItem";
const listStyle = "question";
const answerStyle = "answer hover";
const questionClassID = ".question-list";
const resultSplashTimeMs = 1 * 1000;

//{question: "Test", answers: ["The Unit", "Mix Nine", "K-pop Star", "Idol School", "Dancing 9"]}
const DataBase = [];

function ResetQuiz()
{
    questionIndex = score = 0;
}

// ['classe': '...']
// ['type': 'checkbox' ]
// ['id' : id]
// ['val' : value]
// ['disabled': disable]

// let entry = new LabelButton(styles, `cb${i}`, q.answers[i]);

function LabelButton(classesList, id, value, disable = false)
{
    this.type = "checkbox",
    this.class = classesList,
    this.id = id,
    this.val = value,
    this.disabled = disable,

    this.getCBString = function(){
        return `<input type='${this.type}' id='${this.id}'${this.disabled ? ' disabled' : ''}>`;
    }

    this.getLabelString = function()
    {
        return `<label class='${this.class.join(' ')}' for='${this.id}'>${this.val}</label>`;
    }

    this.getString = function() {
        return `<div>${this.getCBString() + this.getLabelString()}</div>`;
    }
};

function GenerateQuestionString(index)
{
    console.log(`Called GenerateQuestionString`);
    const q = DataBase[index];
    let questionString = [];

    for(let i=0; i<q.answers.length; ++i)
    {
        let styles = [listStyle, answerStyle];
        if(i===0)
            styles.push('solution');
        let entry = new LabelButton(styles, `cb${i}`, q.answers[i]);

        questionString.push(entry.getString());

     }

    shuffleArray(questionString);
    let styles = [listStyle, 'membercolor'];
    questionString.unshift(new LabelButton(styles, 'cbquestion', `${q.question}?`, true).getString());

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
    //console.log(DataBase);
}

function HandleQuiz()
{
    console.log(`Called HandleQuiz`);
    DisableDefaultBehavior();    
    GenerateTable();
    StartQuiz();
}

function StartQuiz()
{
    console.log(`Called StartQuiz`);
    questionIndex = 0;
    score = 0;    
    transitionTimer = null;
    HandleAnswerSelect();
    RenderQuestion(questionIndex);
    CalculateScore();    
}

function DisableDefaultBehavior()
{
    console.log(`Called DisableDefaultBehavior`);
    $('#question-form').submit(event => {
        event.preventDefault();
        AddQuestionToForm();
    });    
}

function AddQuestionToForm()
{
    console.log(`Called AddQuestionToForm`);
    $('.question-form').append(`<button class="btn" value='submit'>Test</button>`);
}

function RenderQuestion(index)
{
    console.log(`Called RenderQuestion`);

    let questionStr = GenerateQuestionString(index);
    // display the current question
    
    $('#question-form').empty().append(questionStr);

    // set color question color
    let colorstr = `rgba( ${hex2rgb(DataBase[index].color)} , 0.5)`;
    $('.membercolor').css('background-color', colorstr);

    //SetBackgroundHighlight(index, index-1);
    //SetBackgroundHighlight(4, -1);
    $('#hl12').addClass('bghl');
}

function SetBackgroundHighlight(index, prevIndex)
{
    const HighLightListOrder = [11, 3, 10, 4, 1, 9, 8, 12, 2, 5, 7, 6];

    if(prevIndex>=0)
        $('#hl' + HighLightListOrder[prevIndex].toString()).removeClass('bghl');
    if(index>=0)
        $('#hl' + HighLightListOrder[index].toString()).addClass('bghl');
}

function hex2rgb(hex)
{
    let lint = parseInt(hex,16);
    return `${(lint >> 16) & 255},${(lint >> 8) & 255},${lint & 255}`;
}

function DisplayFinalResults()
{
    score = 8;
    
    let str = "90 A 80 B 70 C 60 D 50 F";
    let parsed = str.split(' ');

    let grade = "F";
    let percentage = score / DataBase.length * 100;

    for(let i=0; i<parsed.length; i+=2)
    {
        if( percentage > parsed[i])
        {
            grade = parsed[i+1];
            break;
        }
    }

    console.log(grade);

    $('#question-form').empty();

    let styles = ['finalresult'];
    let resultString = `Grade: ${grade}<br>${score} questions correct out of ${DataBase.length}`;
    let resultLabel = new LabelButton(styles, 'cbquestion', resultString, true);
    $('#question-form').append(resultLabel.getString());

    // restart button
    styles = [listStyle, answerStyle];
    resultLabel = new LabelButton(styles, 'restart', "Restart");
    $('#question-form').append(resultLabel.getString());

    $('#question-form').off('mouseup');

    $('#question-form').on('mouseup', function(){
        $('#question-form').off('mouseup');        
        StartQuiz();
    });

    SetBackgroundHighlight(-1, questionIndex);
}

function HandleAnswerSelect()
{
    console.log(`Called HandleAnswerSelect`);

    $('#question-form').on('mouseup', 'label', function(event) {
        let sel = $(this).hasClass("selected");
        console.log(`question-form click, transition? ${transitionTimer == null}, seleced? ${sel}`);

        event.stopPropagation();

        if(transitionTimer != null)
            return;

        if(sel)
        {
            console.log(`disable click`);
            HandleAnswerSubmit(this);
        }
        else if($(this).hasClass("answer"))
        {
            $('label').removeClass("selected");
            $(this).removeClass("selectTransition");
            
            console.log(`toggle selected from ${$(this).hasClass("answer")}`);
            $(this).toggleClass("selected");
        }
    });
}

function HandleAnswerSubmit(eventTarget)
{
    console.log(`Called HandleAnswerSubmit`);

    let resultText = "Incorrect";
    // check answer
    if($(eventTarget).hasClass("solution"))
    {
        UpdateScore(score + 1);
        resultText = 'Correct';        
    }

    $('.solution').css('background-color', $('.membercolor').css('background-color'));

    $('.result').text(resultText);

    $('.result').toggleClass('off');

    DisplayResults();       
}

function DisplayResults()
{
    console.log(`Called DisplayResults`);
    // display final splash summary

    // timer and cleanup page
    transitionTimer = setTimeout(function(){ 
        $('.solution').css('background-color', '');

        $('.result').toggleClass('off');

        let nextQuestion = questionIndex + 1;

        if(nextQuestion >= DataBase.length)
        {
            DisplayFinalResults();
        }
        else
        {
            RenderQuestion(nextQuestion);
            UpdateQuestionNumber(nextQuestion);
        }

        transitionTimer = null;
    }, resultSplashTimeMs);
}

function CalculateScore()
{
    console.log(`Called CalculateScore`);
    $('.score').html(`Score: ${score}<br>Question: ${questionIndex+1}/${DataBase.length}`);
}

function UpdateScore(val)
{
    $('.score').html(`Score: ${val}<br>Question: ${questionIndex+1}/${DataBase.length}`);
    score = val;
}

function UpdateQuestionNumber(val)
{
    $('.score').html(`Score: ${score}<br>Question: ${val+1}/${DataBase.length}`);
    questionIndex = val;
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