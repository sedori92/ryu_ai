// HTML 뼈대에 기능을 부여하기 위해서는 제일먼저
// 기능의 위치를 찾아와야 한다!
const loadMovieBtn = document.querySelector('#loadMovieBtn');
const movieConsole = document.querySelector('#movieConsole');

// ** TMDB URL을 저장하기 위한 공간!
const TMDB_URL = "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1";
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmM2ODkzYTM0OGZiZTgyMmYwM2I4YzdmZDRmMjAzNiIsIm5iZiI6MTc4MjMwNzQ5Mi4xNTIsInN1YiI6IjZhM2JkYWE0M2EyZjk2MTc1NWRkMGNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uvN5TotQqw4987TBFp7Eui434YVhZS6HOL5czAWDJ8Y";


// 원하는 위치를 잘 가져오는지 버튼 클릭 이벤트로 출력해보기!
loadMovieBtn.addEventListener('click', async function(){
    //console.log(loadMovieBtn);
    //console.log(movieConsole);

    // url주소로 요청을 보내고 응답이 돌아올때 까지 기다리다,
    // reponse라는 변수명에 응답된 데이터 저장!
    const response = await fetch(TMDB_URL, {
        method : "GET",
        headers : {
            accept : "application/json",
            Authorization : `Bearer ${TMDB_TOKEN}`
        }
    });

    // 응답된 데이터를 JSON 타입으로 변경!
    const data = await response.json();
    console.log(data);

// 결과 영역에 data 내용 띄위기
    movieConsole.textContent = JSON.stringify(data.results, null, 2);



});