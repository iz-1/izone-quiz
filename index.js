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
let transitionTimer = null;
let prevItem = null;

const listStyle = "question";
const answerStyle = "answer hover";
const resultSplashTimeMs = 2 * 1000;

/*  Table entry format:
    {question: "Test", answers: ["The Unit", "Mix Nine", "K-pop Star", "Idol School", "Dancing 9"], color: F1D2E7}
*/
const DataBase = [];        

// Handle the keyboard focus for input/checkbox items and apply to parent div for style/effect
function CheckboxParentFocus()
{
    console.log(`Called CheckboxParentFocus`);
    $('#question-form div').focusin( function(){
        $(this).addClass('focus');
    });

    $('#question-form div').focusout( function(){
        $(this).removeClass('focus');
    });    
}

// bind keys to handle keyboard input
function BindKeyPress()
{
    console.log(`Called BindKeyPress`);

    // bind keydown display
    /*
    $('main').on('keydown', function(e){
        if(transitionTimer == null && e.keyCode == 32)
        {            
            let focusedItem = $(document.activeElement);
            let childItem = focusedItem.children('label');

            console.log(childItem);

            if(childItem != null)
            {
                
                if(!childItem.hasClass('spacePress'))
                {
                    childItem.addClass('spacePress');

                    if(prevItem != null)
                        prevItem.toggleClass('spacePress');

                    prevItem = childItem;
                }
            }
        }        
    }); */

    // bind keyup selection
    $('main').on('keyup', function(e){
        if(transitionTimer == null && e.keyCode == 32)
        {            
            let focusedItem = $(document.activeElement);
            if(focusedItem != null)
            {
                let childitem = focusedItem.children('label');
                let inputItem = focusedItem.children('input');
                
                if(inputItem.attr('id') == 'restart')
                {
                    StartQuiz();
                }
                else
                {
                    SelectItemByLabel(childitem);
                    //childitem.addClass('selected');
                }
            }
        }
    });
}

// object used to encompass the checkbox/label within a div
function LabelButton(classesList, id, value)
{
    this.class = classesList,
    this.id = id,
    this.val = value,

    this.getInputString = function(){
        return CreateTagString('input', this.class, "", [['type', 'radio'],['id', this.id]]);
    }

    this.getLabelString = function()
    {
        return CreateTagString('label', this.class, this.val, [['for', this.id]]);
    }

    this.getString = function() {
        return CreateTagString('div', [], this.getInputString() + this.getLabelString(), [['tabindex', 0]]);
    }
};

// helper to create a basic html tags
function CreateTagString(tagType, classesList, innerValue, valuePairs)
{
    let tagString = `<${tagType} `;
    if(!classesList.empty)
        tagString += `class='${classesList.join(' ')}'`;
    for(let i=0; i<valuePairs.length; ++i){
        tagString += ` ${valuePairs[i][0]}='${valuePairs[i][1]}'`;
    }
    tagString += '>';

    tagString += (innerValue == "") ? "" : innerValue + `</${tagType}>`;
    return tagString;
}

// creates answer text upon incorrect selection
function GenerageAnswerString(index)
{
    console.log(`Called GenerageAnswerString`);
    return `The Correct answer is ${DataBase[index].answers[0]}`;
}

// constructs the ul list containing the question and answers from the DataBase
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

    let legendElement = CreateTagString('legend', [listStyle, 'membercolor'], q.question, [['id', 'cbquestion']]);
    questionString.unshift(legendElement);

    return questionString.join("");
}

// parses text dump into usable table - @todo regex and remove filter steps
function GenerateTable()
{
    console.log(`Called GenerateTable`);
    let questionList = data.split(new RegExp(['\\\?', '\\\] ', '\\\['].join('|'), 'g'));
    questionList = questionList.filter(item => item != " " && item != "");
    for(let i=0; i<questionList.length; i+=3)
        DataBase.push({question: questionList[i], answers: questionList[i+1].split(", "), color: questionList[i+2]});
}

// Prepare Quiz app
function InitQuiz()
{
    console.log(`Called InitQuiz`);    
    BindKeyPress();
    GenerateBackgroundHighlightElements();
    DisableDefaultBehavior();    
    GenerateTable();
    DisplayStartButton('Start')
}

// Prepare Quiz app
function StartQuiz()
{
    console.log(`Called StartQuiz`);
    questionIndex = 0;
    score = 0;    
    transitionTimer = null;
    HandleAnswerSelect();
    RenderQuestion(questionIndex);
    CheckboxParentFocus();
    DisplayScoreInfo();    
}

// disables form submit behavior
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

// displays the question and background/question styling
function RenderQuestion(index)
{
    console.log(`Called RenderQuestion`);

    let questionStr = GenerateQuestionString(index);
    
    $('#question-form').empty().append(questionStr);

    // set color question color
    let colorstr = `rgba( ${hex2rgb(DataBase[index].color)} , 0.5)`;
    $('.membercolor').css('background-color', colorstr);

    SetBackgroundHighlight(index, index-1);
}

// creates the background elements for highlighting effect
function GenerateBackgroundHighlightElements()
{
    console.log(`Called GenerateBackgroundHighlightElements`);
    let elements = [];
    for(let i=1; i<=12; ++i)
        elements.push(`<li class='highlight' id='hl${i.toString()}'></li>`);

    elements.unshift(`<li class='highlight' id='edge'></li>`);
    $('.bgHighlight').append(elements.join(""));
}

// set/unset background items highlighting
function SetBackgroundHighlight(index, prevIndex)
{
    console.log(`Called SetBackgroundHighlight`);
    const HighLightListOrder = [11, 3, 10, 4, 1, 9, 8, 12, 2, 5, 7, 6];

    if(prevIndex>=0)
        $('#hl' + HighLightListOrder[prevIndex].toString()).removeClass('bghl');
    if(index>=0)
        $('#hl' + HighLightListOrder[index].toString()).addClass('bghl');
}

// generates a button to start/restart the quiz
function DisplayStartButton(btnText)
{
    // restart button
    let styles = [listStyle, answerStyle];
    let resultLabel = new LabelButton(styles, 'restart', btnText);
    $('#question-form').append(resultLabel.getString());
    $('#question-form').off('mouseup');

    $('#question-form').on('mouseup', 'label', function(){
        $('#question-form').off('mouseup');        
        StartQuiz();
    });
}

// convert hex color to rgb string
function hex2rgb(hex)
{
    let lint = parseInt(hex,16);
    return `${(lint >> 16) & 255},${(lint >> 8) & 255},${lint & 255}`;
}

// display final results screen, with score/grade and create button to restart quiz
function DisplayFinalResults()
{   
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
    let resultLabel = CreateTagString('legend', styles, resultString, [['id', 'cbquestion']]);
    $('#question-form').append(resultLabel);

    DisplayStartButton('Restart');
    SetBackgroundHighlight(-1, questionIndex);
}

function SelectItemByLabel(targetObj)
{
    HandleAnswerSubmit(targetObj);

    //@todo indicate double selection to user 

    /*
    let sel = $(targetObj).hasClass("selected");

    if(sel)
    {
        console.log(`disable click`);
        HandleAnswerSubmit(targetObj);
    }
    else if($(targetObj).hasClass("answer"))
    {
        $('label').removeClass("selected");
        $(this).removeClass("selectTransition");
        $(targetObj).toggleClass("selected");
    }
    */
}

// handles mouse selection of answer
function HandleAnswerSelect()
{
    console.log(`Called HandleAnswerSelect`);

    $('#question-form').on('mouseup', 'label', function(event) {        
        event.stopPropagation();

        console.log(this);

        if(transitionTimer != null)
            return;

        SelectItemByLabel(this);
    });
}

// check answer selection for correct answer and indicate if matched solution and update score
function HandleAnswerSubmit(eventTarget)
{
    console.log(`Called HandleAnswerSubmit`);

    let resultText = '';
    // check answer
    if($(eventTarget).hasClass("solution"))
    {
        score++;
        DisplayScoreInfo();
        resultText = 'Correct';        
        $('.result').removeClass('off');
    }
    else
    {
        // set solution to display to user
        resultText = GenerageAnswerString(questionIndex);
        $('.result').addClass('off');
    }

    $('.solution').css('background-color', $('.membercolor').css('background-color'));
    $('.result').text(resultText);
    $('.result').css('visibility', 'visible');
    
    TransitionNextScreen();       
}

// after result of question selected is displayed, set the next question or display final results
function TransitionNextScreen()
{
    console.log(`Called TransitionNextScreen`);

    // timer and cleanup page
    transitionTimer = setTimeout(function(){ 
        $('.solution').css('background-color', '');
        $('.result').css('visibility', 'hidden');
        let nextQuestion = questionIndex + 1;

        if(nextQuestion >= DataBase.length)
        {
            DisplayFinalResults();
        }
        else
        {
            RenderQuestion(nextQuestion);
            questionIndex = nextQuestion;
            DisplayScoreInfo();
        }

        transitionTimer = null;
    }, resultSplashTimeMs);
}

// update score info
function DisplayScoreInfo()
{
    console.log(`Called DisplayScoreInfo`);
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

$(InitQuiz);