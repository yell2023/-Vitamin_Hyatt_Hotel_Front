async function getReviews() {
  params = new URLSearchParams(window.location.search);
  room_id = params.get("room_id");
  const response = await fetch(`${backend_base_url}/reviews/room/${room_id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "GET",
  });
  //해당 숙소 리뷰 조회
  const response_json = await response.json();
  $("#detailroom-info").empty();
  console.log(response_json);
  const name = response_json["name"];
  const description = response_json["description"];
  const price = response_json["price"];
  const max_members = response_json["max_members"];
  const roomid = response_json["id"];
  let temp_html = `
                      <h3>${name}</h3>
                      <p class="content">설명 : ${description}</p>
                      <p class="content">가격 : ${price}</p>
                      <p class="content">최대 인원 : ${max_members}</p>
                      <a class="cp-button secondary" type="button" onclick="saveRoomId(${roomid})" data-bs-toggle="modal" data-bs-target="#book">예약하기</a>`;
  $("#detailroom-info").append(temp_html);
  $("#roomreview_info").empty();
  response_json["review_set"].forEach((a) => {
    const user = a["user"];
    const title = a["title"];
    const context = a["context"];
    const stars = a["stars"];
    let temp_html = `<tr>
                      <th>${user}</th>
                      <td>${title}</td>
                      <td>${context}</td>
                      <td>${stars}</td>
                  </tr>
  `;
    $("#roomreview_info").append(temp_html);
  });
  // if (response.status == 200) {
  //   const response_json = await response.json()
  //   return response_json
  // } else {
  //   alert("불러오는데 실패했습니다!")
  // }
}
getReviews();
var savedRoomId;
function saveRoomId(roomid) {
  savedRoomId = roomid;
  document.getElementById("reservationsavediv");
  $("#reservationsavediv").empty();
  let temp_html = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소하기
            </button>
            <button type="button" class="btn btn-primary" style="float: right" onclick="handleCreateReservation(${roomid})">
              예약하기
            </button>
    `;
  $("#reservationsavediv").append(temp_html);
}
async function handleCreateReservation(roomid) {
  const bookuser = document.getElementById("bookuser").value;
  const booknumber = document.getElementById("booknumber").value;
  const bookmember = parseInt(document.getElementById("bookmember").value);
  const check_in = document.getElementById("check_in").value;
  const check_out = document.getElementById("check_out").value;
  console.log(bookuser, booknumber, bookmember, check_in, check_out);
  console.log(roomid, "확인");
  const data = {
    bookuser: bookuser,
    booknumber: booknumber,
    bookmember: bookmember,
    check_in: check_in,
    check_out: check_out,
  };
  const response = await fetch(
    `${backend_base_url}/manager/rooms/book/${roomid}/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const response_json = await response.json();
  console.log(response_json);
}
