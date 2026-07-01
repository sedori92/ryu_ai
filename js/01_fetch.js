// 
// 
// 
// const 버튼이름
const loadPostBtn = document.querySelector("#loadPostBtn");

const result = document.querySelector("#result");

//  가져온 위치를 consle.log로 확인

// console.log(loadPostBtn, result);
// 1. fetch('url주소)를 이용해서 데이터를 가져오기

loadPostBtn.addEventListener("click", async function (){

    result.textContent = '로딩 중.......';   

    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
   
    console.log(response);

    //  json() 메서드를 이용해서 데이터를 가져오기
    const data = await response.json();
    console.log(data.userId);
    console.log(data.id);
    console.log(data.title);
    
    //  RESULT.INNERHTML = `
    //      <H2>${data.title}</H2>
    //      <P>${data.body}</P> 
    ``

     result.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.body}</p>
    `

    // '



});
