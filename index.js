const baseUrl = "https://opentdb.com/api.php?amount=1";
const containerEl = document.querySelector('.container')
const form = document.querySelector('#quiz_form')
const qusEl = document.querySelector('.ques')
const optionEl = document.querySelector(".all_options")
const buttonEl = document.querySelector('.buttons')
const scoreEl = document.querySelector('.score_board .score_num')
const answerEl = document.querySelector('.score_board .answred_num')
const submitBtn = document.querySelector(".submit_btn");

// greeting section
const greetSection = document.querySelector(".greeting_section");
const greetInput = document.querySelector(".greeting_input");
const greetButton = document.querySelector(".greeting_button");
const greeting = document.querySelector(".greeting");
const alert_box = document.querySelector(".alert_section");
const alertBtn  = document.querySelector(".alert_btn");


greetButton.addEventListener("click",()=>{
    if(greetInput.value ==""){
        alert_box.style.display='block';
        alertBtn.addEventListener("click",()=>{
            alert_box.style.display='none';
        })
    }
    else{
        greeting.style.display = "none";

        const playerName = greetInput.value;
        const greetPopup = document.createElement("div");
        greetPopup.classList.add("greetPopup")
        greetPopup.innerHTML = `
        <h1>Welcome ${playerName}! Enjoy your quiz</h1>
                <button id = "startbtn" class="start_playing_btn">Start</button>
        ` 
        greetSection.appendChild(greetPopup);
    

        const startBtn = document.querySelector("#startbtn");
        startBtn.addEventListener("click", ()=>{
            greetSection.style.display = 'none';
        })
    }
    
})
let ques, ans;
let options = [];
let score = 0;
let answerdQues = 0;


window.addEventListener('DOMContentLoaded', quizApp);


async function quizApp() {


    addplaceholder()
    
    const data = await fetchQuiz();

    ques = data[0].question;
    options = [];
    ans = data[0].correct_answer;
    data[0].incorrect_answers.map(option => options.push(option));
    options.splice(Math.floor(Math.random() * options.length + 1), 0, ans);
    generateTemplate(ques, options);
}

form.addEventListener('submit',(e)=>
{
    e.preventDefault();
    if(e.target.quiz.value)
    {
        cheakQuiz(e.target.quiz.value);
        e.target.querySelector('button').style.display = "none";
       generateButtons();
    }else return;
})


// after receiving all the data now we are generating html content and putting data there

function generateTemplate(ques, options) {

    removePlaceholder();
    optionEl.innerHTML = '';
    qusEl.innerText = ques;

    options.map((option,index) => {
        const item = document.createElement('div');
        item.classList.add('option');
        item.innerHTML = 
        `
        <input type="radio" id="option_${index}" value="${option}" name="quiz">
        <label for="option_${index}">${option}</label>
        `
        optionEl.appendChild(item);
    })
}

function cheakQuiz(selectedOption)
{
    answerdQues++;
    if(selectedOption=== ans) 
    {
        score++;
    }

    updateScoreBoard();

    form.quiz.forEach(input => {
        if(input.value === ans)
        {
            input.parentElement.classList.add('correct');
        }
     
    });
}

function updateScoreBoard()
{
    scoreEl.innerText = score;
    answerEl.innerText = answerdQues;
}

function generateButtons()
{
   

    const finishbtn = document.createElement('button');
    finishbtn.innerText = 'Finsh';
    finishbtn.setAttribute('type','button');
    finishbtn.classList.add('finish_btn');
    buttonEl.appendChild(finishbtn);

    const nextbtn = document.createElement('button');
    nextbtn.innerText = 'Next';
    nextbtn.setAttribute('type','button');
    nextbtn.classList.add('next_btn');
    buttonEl.appendChild(nextbtn);

    finishbtn.addEventListener('click',finishQuiz);
    nextbtn.addEventListener('click',nextQuiz);
}


function nextQuiz()
{
    const nextbtn = document.querySelector('.next_btn');
    const finishbtn = document.querySelector(".finish_btn");
    
    buttonEl.removeChild(nextbtn);
    buttonEl.removeChild(finishbtn);
    
    quizApp();
    buttonEl.lastElementChild.style.display = "block";  
}

function finishQuiz()
{
    const nextbtn = document.querySelector('.next_btn');
    const finishbtn = document.querySelector(".finish_btn");
    
    buttonEl.removeChild(nextbtn);
    buttonEl.removeChild(finishbtn);
    
    buttonEl.lastElementChild.style.display = "block";  

    const overlay = document.createElement('div');
    overlay.classList.add('result_overlay');
    overlay.innerHTML =`
    <div class="final_result"><h1>Total Score :${score} </h1>
    <h1>Question Attempted : ${answerdQues}<h1/>
    <button class = "play_again">Play again</button>
    </div>
    `
    containerEl.append(overlay);

    const play_again = document.querySelector('.play_again');

    play_again.addEventListener('click',()=>{
        score = 0;
        answerdQues = 0;
        scoreEl.innerText = 0;
        answerEl.innerText = 0;
        containerEl.removeChild(overlay);
        quizApp();
    })
}
// fetching data from the server
async function fetchQuiz() {
    const response = await fetch(baseUrl);
    const data = await response.json();
    // console.log(data.results);
    return data.results; // after we receive response now we are returning this to quizApp function
}

function addplaceholder()
{
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    containerEl.appendChild(placeholder);
    console.log(placeholder);
}

function removePlaceholder()
{
    const placeholder = document.querySelector('.placeholder');
    console.log(placeholder);
    containerEl.removeChild(placeholder);
}