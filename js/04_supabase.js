// supabase사용하기 위한 필수코드
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://afaqfzihplhjrbkpkvzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYXFmemlocGxoanJia3BrdnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjUwNDEsImV4cCI6MjA5ODI0MTA0MX0.Qosl1adkZ-9OHu75eKit5NWs33BI4pIW9fqhK5PxbqI"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const loadSavedBtn = document.querySelector('#loadSavedBtn');
const savedMovieList = document.querySelector('#savedMovieList');

//  버튼 클릭 이벤트를 통해 저장된 영화 정보를 가져오기
loadSavedBtn.addEventListener('click', async function() {


    await loadSavedMovies();


});

 async function loadSavedMovies() {
    savedMovieList.innerHTML = "<p>저장된 영화를 불러오는 중입니다.</p>";
    const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("id", { ascending: false });

    if(error){
        console.log(error);
        savedMovieList.innerHTML = "<p>데이터를 불러오지 못했습니다.</p>";
        return;
    }

    renderSavedMovies(data);
}

function renderSavedMovies(moveis){
    savedMovieList.innerHTML = "";

    moveis.forEach(function (movie) {
        const card = document.createElement("article");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${movie.poster_url}" alt="${movie.title} 포스터">
            <h2>${movie.title}</h2>
            <p>개봉일: ${movie.release_date}</p>
            <p>메모: ${movie.memo || "없음"}</p>
        `;

        savedMovieList.appendChild(card);
    });
}